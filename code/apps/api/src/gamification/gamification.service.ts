import { Injectable } from '@nestjs/common';
import {
  MaterialType,
  Prisma,
  QuestStatus,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MATERIAL_READ_XP, XP_PER_LEVEL } from '../common/constants';

type MaterialRow = {
  id: number;
  userId: number;
  type: MaterialType;
  completed: boolean;
};

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  async onMaterialCompleted(userId: number, material: MaterialRow) {
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.material.update({
        where: { id: material.id },
        data: { completed: true, completedAt: now },
      });

      await tx.xpLog.create({
        data: {
          userId,
          amount: MATERIAL_READ_XP,
          reason: 'MATERIAL_READ',
          createdAt: now,
        },
      });

      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      const newTotalXp = user.totalXp + MATERIAL_READ_XP;
      const newStreak = this.calculateStreak(user.lastActivityDate, user.currentStreak, now);

      await tx.user.update({
        where: { id: userId },
        data: {
          totalXp: newTotalXp,
          currentStreak: newStreak,
          lastActivityDate: now,
        },
      });

      await this.updateQuestProgress(tx, userId, material.type);
      await this.grantEligibleAchievements(tx, userId, newTotalXp, newStreak);
    });
  }

  calculateLevel(totalXp: number): number {
    return Math.floor(totalXp / XP_PER_LEVEL) + 1;
  }

  levelProgressPercent(totalXp: number): number {
    const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
    return Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100);
  }

  private calculateStreak(
    lastActivityDate: Date | null,
    currentStreak: number,
    now: Date,
  ): number {
    if (!lastActivityDate) {
      return 1;
    }

    const lastDay = this.startOfDay(lastActivityDate);
    const today = this.startOfDay(now);

    if (lastDay.getTime() === today.getTime()) {
      return currentStreak;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDay.getTime() === yesterday.getTime()) {
      return currentStreak + 1;
    }

    return 1;
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private async updateQuestProgress(
    tx: Prisma.TransactionClient,
    userId: number,
    materialType: MaterialType,
  ) {
    const userQuests = await tx.userQuest.findMany({
      where: { userId, status: QuestStatus.ACTIVE },
      include: { quest: true },
    });

    for (const userQuest of userQuests) {
      let shouldIncrement = false;

      if (userQuest.quest.title.includes('статьи') && materialType === MaterialType.ARTICLE) {
        shouldIncrement = true;
      } else if (userQuest.quest.title.includes('Серия')) {
        shouldIncrement = true;
      } else if (
        userQuest.quest.title.includes('мини-курс') &&
        materialType === MaterialType.COURSE
      ) {
        shouldIncrement = true;
      }

      if (!shouldIncrement) {
        continue;
      }

      const newProgress = Math.min(userQuest.progress + 1, userQuest.quest.targetCount);
      const completed = newProgress >= userQuest.quest.targetCount;

      await tx.userQuest.update({
        where: { id: userQuest.id },
        data: {
          progress: newProgress,
          status: completed ? QuestStatus.COMPLETED : QuestStatus.ACTIVE,
        },
      });

      if (completed) {
        await tx.xpLog.create({
          data: {
            userId,
            amount: userQuest.quest.rewardXp,
            reason: 'QUEST_COMPLETE',
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: { totalXp: { increment: userQuest.quest.rewardXp } },
        });
      }
    }
  }

  private async grantEligibleAchievements(
    tx: Prisma.TransactionClient,
    userId: number,
    totalXp: number,
    currentStreak: number,
  ) {
    const rules: { code: string; eligible: boolean }[] = [
      { code: 'FIRST_100_XP', eligible: totalXp >= 100 },
      { code: 'STREAK_3', eligible: currentStreak >= 3 },
      { code: 'STREAK_10', eligible: currentStreak >= 10 },
    ];

    for (const rule of rules) {
      if (!rule.eligible) {
        continue;
      }

      const achievement = await tx.achievement.findUnique({
        where: { code: rule.code },
      });

      if (!achievement) {
        continue;
      }

      await tx.userAchievement.upsert({
        where: {
          userId_achievementId: { userId, achievementId: achievement.id },
        },
        create: { userId, achievementId: achievement.id },
        update: {},
      });
    }
  }
}
