import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';
import { Repository } from 'typeorm';
import { Word } from '../domain/word';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(WordEntity)
    private wordRepository: Repository<WordEntity>,
  ) {}

  getRandomWords(count: number): Promise<Word[]> {
    return this.wordRepository
      .createQueryBuilder('word')
      .distinctOn(['word.english'])
      .orderBy('RANDOM()')
      .limit(count)
      .getMany();
  }
}
