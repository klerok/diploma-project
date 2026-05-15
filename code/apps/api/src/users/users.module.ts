import { Module } from '@nestjs/common';
import { GamificationModule } from '../gamification/gamification.module';
import { MeController } from './me.controller';
import { UsersService } from './users.service';

@Module({
  imports: [GamificationModule],
  controllers: [MeController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
