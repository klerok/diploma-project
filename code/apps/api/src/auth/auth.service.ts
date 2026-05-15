import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { nickname: dto.nickname }],
      },
    });

    if (existing) {
      throw new ConflictException('Email или ник уже заняты');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email: dto.email,
            password: passwordHash,
            nickname: dto.nickname,
          },
          select: { id: true, email: true, nickname: true },
        });

        const quests = await tx.quest.findMany({
          select: { id: true, targetCount: true },
        });

        if (quests.length > 0) {
          await tx.userQuest.createMany({
            data: quests.map((quest) => ({
              userId: created.id,
              questId: quest.id,
              progress: 0,
            })),
          });
        }

        return created;
      });

      return this.buildAuthResponse(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = String(error.meta?.target ?? '');
        if (target.includes('email') || target.includes('nickname')) {
          throw new ConflictException('Email или ник уже заняты');
        }
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const passwordValid = await this.verifyPassword(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.buildAuthResponse({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    });
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      throw new UnauthorizedException();
    }

    return user;
  }

  private verifyPassword(plain: string, stored: string): Promise<boolean> {
    return bcrypt.compare(plain, stored);
  }

  private buildAuthResponse(user: { id: number; email: string; nickname: string }) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, user };
  }
}
