import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [AuthModule, UsersModule, PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })]
})
export class AppModule { }
