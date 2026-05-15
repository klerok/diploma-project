import { Module } from '@nestjs/common';
import { GamificationModule } from '../gamification/gamification.module';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';

@Module({
  imports: [GamificationModule],
  controllers: [MaterialsController],
  providers: [MaterialsService],
})
export class MaterialsModule {}
