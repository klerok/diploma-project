import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MaterialType } from '../../generated/prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from '../auth/auth-user.type';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';

@Controller('materials')
@UseGuards(JwtAuthGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('type', new ParseEnumPipe(MaterialType, { optional: true }))
    type?: MaterialType,
  ) {
    return this.materialsService.findAll(user.id, type);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(user.id, createMaterialDto);
  }

  @Patch(':id/complete')
  complete(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.materialsService.complete(id, user.id);
  }
}
