import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ConfigModule, JwtModule.register({}), UserModule],
})
export class AuthModule {}
