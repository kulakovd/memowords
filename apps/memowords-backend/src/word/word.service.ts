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

  async getRandomWords(count: number): Promise<Word[]> {
    const raw = await this.wordRepository.query(
      `
        SELECT * FROM (
            SELECT DISTINCT ON (english) id, english, russian
            FROM word_entity
            ORDER BY english, random()
        ) w3 ORDER BY random() LIMIT ${count};
        `,
    );

    return raw as Word[];
  }

  getWordById(id: string): Promise<Word | null> {
    return this.wordRepository.findOneBy({ id });
  }
}
