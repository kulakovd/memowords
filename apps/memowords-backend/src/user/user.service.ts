import { Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserByTelegramId(telegramId: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      telegramId,
    });
  }

  async createUser(telegramId: string): Promise<User> {
    return this.userRepository.save({
      telegramId,
    });
  }

  async findOrCreateUserByTelegramId(telegramId: string): Promise<User> {
    const user = await this.findUserByTelegramId(telegramId);
    if (user != null) {
      return user;
    }

    return this.createUser(telegramId);
  }
}
