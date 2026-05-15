import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import {
  AUTH_COOKIE_MAX_AGE_MS,
  AUTH_COOKIE_NAME,
} from '../common/constants';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthUser } from './auth-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setAuthCookie(res, result.accessToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setAuthCookie(res, result.accessToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookie(res);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user.id);
  }

  private setAuthCookie(res: Response, token: string) {
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: AUTH_COOKIE_MAX_AGE_MS,
      path: '/',
    });
  }

  private clearAuthCookie(res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
  }
}
