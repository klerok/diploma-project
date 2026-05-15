import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from '../auth/auth-user.type';
import { UsersService } from './users.service';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: AuthUser) {
    return this.usersService.getDashboard(user.id);
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.usersService.getStats(user.id);
  }

  @Get('achievements')
  getAchievements(@CurrentUser() user: AuthUser) {
    return this.usersService.getAchievements(user.id);
  }

  @Get('xp-logs')
  getXpLogs(@CurrentUser() user: AuthUser) {
    return this.usersService.getXpLogs(user.id);
  }

  @Get('quests')
  getQuests(@CurrentUser() user: AuthUser) {
    return this.usersService.getQuests(user.id);
  }
}
