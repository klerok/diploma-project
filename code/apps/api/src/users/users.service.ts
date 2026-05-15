import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamification: GamificationService,
  ) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        totalXp: true,
        currentStreak: true,
        lastActivityDate: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async getDashboard(id: number) {
    const user = await this.findOne(id);

    const [materialsTotal, materialsCompleted] = await Promise.all([
      this.prisma.material.count({ where: { userId: id } }),
      this.prisma.material.count({ where: { userId: id, completed: true } }),
    ]);

    const progressPercent =
      materialsTotal === 0
        ? 0
        : Math.round((materialsCompleted / materialsTotal) * 100);

    return {
      totalXp: user.totalXp,
      currentStreak: user.currentStreak,
      materialsTotal,
      materialsCompleted,
      progressPercent,
    };
  }

  async getStats(id: number) {
    const user = await this.findOne(id);
    const materialsCompleted = await this.prisma.material.count({
      where: { userId: id, completed: true },
    });

    const level = this.gamification.calculateLevel(user.totalXp);
    const levelProgressPercent = this.gamification.levelProgressPercent(user.totalXp);

    return {
      level,
      materialsCompleted,
      currentStreak: user.currentStreak,
      totalXp: user.totalXp,
      levelProgressPercent,
      nextLevel: level + 1,
    };
  }

  async getAchievements(id: number) {
    await this.findOne(id);

    const achievements = await this.prisma.achievement.findMany({
      orderBy: { id: 'asc' },
      include: {
        userAchievements: {
          where: { userId: id },
          select: { earnedAt: true },
        },
      },
    });

    return achievements.map((achievement) => ({
      id: achievement.id,
      code: achievement.code,
      title: achievement.title,
      earned: achievement.userAchievements.length > 0,
      earnedAt: achievement.userAchievements[0]?.earnedAt ?? null,
    }));
  }

  async getXpLogs(id: number) {
    await this.findOne(id);

    return this.prisma.xpLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getQuests(id: number) {
    await this.findOne(id);

    const userQuests = await this.prisma.userQuest.findMany({
      where: { userId: id },
      include: { quest: true },
      orderBy: { questId: 'asc' },
    });

    return userQuests.map((userQuest) => ({
      id: userQuest.quest.id,
      title: userQuest.quest.title,
      description: userQuest.quest.description,
      targetCount: userQuest.quest.targetCount,
      rewardXp: userQuest.quest.rewardXp,
      progress: userQuest.progress,
      status: userQuest.status,
    }));
  }
}
