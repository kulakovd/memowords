import { Injectable } from '@nestjs/common';
import { Question } from '../domain/question';
import { InjectRepository } from '@nestjs/typeorm';
import { LearningEntity } from './learning.entity';
import { Repository } from 'typeorm';
import { WordService } from '../word/word.service';
import { Answer } from '../domain/answer';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Injectable()
export class LearningService {
  constructor(
    @InjectRepository(LearningEntity)
    private learningRepository: Repository<LearningEntity>,
    private wordService: WordService,
  ) {}

  private async getOrCreateLearning(
    userId: string,
    wordId: string,
  ): Promise<LearningEntity> {
    const learning = await this.learningRepository
      .createQueryBuilder('learning')
      .where('learning.userId = :userId', { userId })
      .andWhere('learning.wordId = :wordId', { wordId })
      .getOne();

    if (learning != null) {
      return learning;
    }

    const newLearning = new LearningEntity();
    newLearning.userId = userId;
    newLearning.wordId = wordId;

    await this.learningRepository.insert(newLearning);

    return newLearning;
  }

  private calculateNextRepetition(interval: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + interval);
    return date;
  }

  async reviewLearning(answer: Answer, userId: string): Promise<void> {
    const learning = await this.getOrCreateLearning(userId, answer.wordId);

    if (answer.idk || !answer.isCorrect) {
      learning.repetitions = 0;
      learning.interval = 1;
    } else if (answer.isCorrect) {
      const score = 5;

      // easiness factor is a value between 1.3 and 2.5
      learning.easinessFactor = Math.max(
        1.3,
        learning.easinessFactor +
          (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02)),
      );

      learning.repetitions += 1;

      if (learning.repetitions === 1) {
        learning.interval = 1;
      } else if (learning.repetitions === 2) {
        learning.interval = 6;
      } else {
        learning.interval = Math.round(
          learning.interval * learning.easinessFactor,
        );
      }
    }

    learning.nextRepetition = this.calculateNextRepetition(learning.interval);

    await this.learningRepository.save(learning);
  }

  async nextQuestion(): Promise<Question> {
    const nextLearning = await this.learningRepository
      .createQueryBuilder('learning')
      .where('learning.nextRepetition <= now()')
      .orderBy('learning.nextRepetition', 'ASC')
      .getOne();

    if (nextLearning != null) {
      const correctPosition = randomInt(0, 3);
      const options = await this.wordService.getRandomWords(3);
      const word = await this.wordService.getWordById(nextLearning.wordId);
      options.splice(correctPosition, 0, word!);

      return {
        options,
        correctOption: nextLearning.wordId,
      };
    }

    // when there is no next learning, we return random words and mark one of them as correct
    const options = await this.wordService.getRandomWords(4);

    return {
      options,
      correctOption: options[randomInt(0, 3)].id,
    };
  }
}
