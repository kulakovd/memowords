import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public';
import { Reflector } from '@nestjs/core';

/**
 * The AuthGuard is responsible for checking if the user is authenticated.
 * It is used as a global guard in the AuthModule.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    /** If the route is marked as public, then the user is authenticated. */
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    /** Bearer token */
    const token = this.extractTokenFromHeader(request);

    if (token == null) {
      throw new UnauthorizedException();
    }

    try {
      const payload = (await this.jwtService.verify(token, {
        secret: this.configService.get('accessTokenSecret'),
      })) as { sub: string };

      // Token's payload is available in the request object in any controller
      request.userId = payload.sub;

      return true;
    } catch (e) {
      // Send 401 response
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
