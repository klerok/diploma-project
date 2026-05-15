import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_COOKIE_NAME } from '../common/constants';
import type { AuthUser } from './auth-user.type';

type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          if (bearer) {
            return bearer;
          }
          return request.cookies?.[AUTH_COOKIE_NAME] ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'readquest-dev-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, nickname: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
