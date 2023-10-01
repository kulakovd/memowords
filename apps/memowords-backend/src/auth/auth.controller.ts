import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('telegram')
  async telegramLogin(@Body() { data }: { data: string }) {
    const token = await this.authService.telegramLogin(data);

    return {
      token,
    };
  }
}
