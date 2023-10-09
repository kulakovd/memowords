import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

/**
 * The data that Telegram Web App sends to the backend.
 * This type describes the data partially, because we don't need all the fields.
 * See full description here: https://core.telegram.org/bots/webapps#webappinitdata
 */
type TelegramLoginData = {
  user?: string;
  hash: string;
};

const algorithm = { name: 'HMAC', hash: 'SHA-256' };

/**
 * Converts ArrayBuffer to hex string.
 * @param buffer The buffer to convert.
 */
function buf2hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Parses the data from Telegram Web App.
 * @param data
 */
function parseData(data: string): TelegramLoginData {
  const decoded = decodeURIComponent(data);
  return Object.fromEntries(
    decoded.split('&').map((line) => line.split('=') as [string, string]),
  ) as TelegramLoginData;
}

/**
 * Signs the data with the key using HMAC-SHA256 algorithm.
 * @param data
 * @param key
 */
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

  /**
   * Generates a key for validate initData from Telegram Web App.
   *
   * @private
   */
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

  /**
   * Verifies that the data is received from Telegram Web App.
   *
   * @param data Data received from Telegram Web App
   * @private
   * @throws {UnauthorizedException} If the data is not received from Telegram Web App
   */
  private async verify(data: TelegramLoginData) {
    const { hash, ...rest } = data;

    /** String that contains a chain of all received fields, sorted alphabetically, separated by a newline character, in format key=value */
    const dataCheck = Object.keys(rest)
      .sort()
      .map((key) => [key, rest[key as keyof typeof rest]].join('='))
      .join('\n');

    const encoder = new TextEncoder();

    const signedData = await crypto.subtle.sign(
      algorithm,
      await this.key,
      encoder.encode(dataCheck),
    );

    const hexData = buf2hex(signedData);

    // The hex representation of the HMAC-SHA256 signature of the data should match the hash field.
    // Otherwise, the data is not received from Telegram Web App.
    if (hash !== hexData) {
      throw new UnauthorizedException();
    }
  }

  /**
   * Receives data from Telegram Web App, validates it, and returns JWT token.
   * Validation algorithm is described here: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
   *
   * @param data String received from Telegram (window.Telegram.WebApp.initData)
   */
  async telegramLogin(data: string): Promise<string> {
    if (data === '') {
      throw new UnauthorizedException();
    }

    const parsed = parseData(data);

    await this.verify(parsed);

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
