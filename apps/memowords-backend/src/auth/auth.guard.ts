import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token == null) {
      throw new UnauthorizedException();
    }

    const payload = (await this.jwtService.verify(token, {
      secret: this.configService.get('accessTokenSecret'),
    })) as { sub: string };

    request.user = payload.sub;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers.get('Authorization')?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
