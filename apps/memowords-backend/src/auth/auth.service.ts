import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

type TelegramLoginData = {
  user?: string;
  query_id?: string;
  hash: string;
};

const algorithm = { name: 'HMAC', hash: 'SHA-256' };

function buf2hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

function parseData(data: string): TelegramLoginData {
  const decoded = decodeURIComponent(data);
  return Object.fromEntries(
    decoded.split('&').map((line) => line.split('=') as [string, string]),
  ) as TelegramLoginData;
}

async function hmacSha256(data: string, key: string) {
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    algorithm,
    false,
    ['sign'],
  );

  return crypto.subtle.sign(algorithm, cryptoKey, encoder.encode(data));
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private _key: CryptoKey;

  private get key(): Promise<CryptoKey> {
    if (this._key !== undefined) {
      return Promise.resolve(this._key);
    }

    const telegramBotToken = this.configService.get('telegramBotToken');
    return hmacSha256(telegramBotToken, 'WebAppData')
      .then((key) =>
        crypto.subtle.importKey('raw', key, algorithm, false, ['sign']),
      )
      .then((key) => {
        this._key = key;
        return key;
      });
  }

  private async verify(data: string, hash: string) {
    const encoder = new TextEncoder();

    const signedData = await crypto.subtle.sign(
      algorithm,
      await this.key,
      encoder.encode(data),
    );

    const hexData = buf2hex(signedData);

    if (hash !== hexData) {
      throw new UnauthorizedException();
    }
  }

  async telegramLogin(data: string): Promise<string> {
    if (data === '') {
      throw new UnauthorizedException();
    }

    const { hash, ...parsed } = parseData(data);

    const dataCheck = Object.keys(parsed)
      .sort()
      .map((key) => [key, parsed[key as keyof typeof parsed]].join('='))
      .join('\n');

    await this.verify(dataCheck, hash);

    const accessTokenSecret = this.configService.get('accessTokenSecret');

    if (parsed.user == undefined) {
      throw new UnauthorizedException();
    }

    const userData = JSON.parse(parsed.user) as { id: string };

    const user = await this.userService.findOrCreateUserByTelegramId(
      userData.id,
    );

    const tokenPayload = JSON.stringify({
      sub: user.id,
    });

    return this.jwtService.sign(tokenPayload, {
      secret: accessTokenSecret,
    });
  }
}
