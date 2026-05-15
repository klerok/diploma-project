import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GamificationModule } from './gamification/gamification.module';
import { MaterialsModule } from './materials/materials.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GamificationModule,
    UsersModule,
    MaterialsModule,
  ],
})
export class AppModule {}
