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

  /**
   * If the user answered the word first time,
   * we create a new learning process for the word.
   *
   * @param userId
   * @param wordId
   * @private
   */
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

  /**
   * Reviews the learning process of a word for a user.
   * It implements the SM-2 algorithm, but it is not a complete implementation.
   * It uses only 0 and 5 as the possible scores.
   * - 0 means that the user doesn't know the word or the answer is wrong.
   * - 5 means that the answer is correct.
   *
   * @param answer
   * @param userId
   */
  async reviewLearning(answer: Answer, userId: string): Promise<void> {
    const learning = await this.getOrCreateLearning(userId, answer.wordId);

    if (answer.idk || !answer.isCorrect) {
      // When the user doesn't know the answer or the answer is wrong,
      // we reset the learning process to the beginning, but we keep the easiness factor.
      // It leads to sooner appearance of the word in the learning process.
      learning.repetitions = 0;
      learning.interval = 1;
    } else if (answer.isCorrect) {
      // easiness factor is a value between 1.3 and 2.5
      learning.easinessFactor = Math.max(
        1.3,
        // Since the score of the correct answer is always 5,
        // we can simplify the formula to just add 0.1 to the easiness factor.
        // You can find the original formula in the SM-2 algorithm description:
        // https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
        learning.easinessFactor + 0.1,
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

  /**
   * Returns the next question for the user
   * If there are words to review,
   * a question will be returned for one with the earliest next repetition date.
   * Otherwise, a question will be returned with random words.
   *
   * @param userId
   */
  async nextQuestion(userId: string): Promise<Question> {
    const nextLearning = await this.learningRepository
      .createQueryBuilder('learning')
      .where('learning.nextRepetition <= now()')
      .andWhere('learning.userId = :userId', { userId })
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
