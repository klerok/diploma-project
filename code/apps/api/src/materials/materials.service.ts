import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MaterialType } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { CreateMaterialDto } from './dto/create-material.dto';

@Injectable()
export class MaterialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamification: GamificationService,
  ) {}

  async findAll(userId: number, type?: MaterialType) {
    return this.prisma.material.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: number, dto: CreateMaterialDto) {
    if (dto.title.trim().length < 3) {
      throw new BadRequestException('Название должно содержать минимум 3 символа.');
    }

    if (dto.pages < 1 || dto.pages > 500) {
      throw new BadRequestException('Количество страниц должно быть от 1 до 500.');
    }

    return this.prisma.material.create({
      data: {
        userId,
        title: dto.title.trim(),
        type: dto.type,
        pages: dto.pages,
        sourceUrl: dto.sourceUrl?.trim() || null,
      },
    });
  }

  async complete(id: number, userId: number) {
    const material = await this.prisma.material.findFirst({
      where: { id, userId },
    });

    if (!material) {
      throw new NotFoundException('Материал не найден');
    }

    if (material.completed) {
      throw new BadRequestException('Материал уже отмечен как прочитанный');
    }

    await this.gamification.onMaterialCompleted(userId, material);

    return this.prisma.material.findUniqueOrThrow({ where: { id } });
  }

}
