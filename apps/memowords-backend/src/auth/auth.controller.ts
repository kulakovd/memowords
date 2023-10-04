import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('telegram')
  async telegramLogin(@Body() { data }: { data: string }) {
    const token = await this.authService.telegramLogin(data);

    return {
      token,
    };
  }
}
