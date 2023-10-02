import { User } from './user';
import { Word } from './word';

export interface Learning {
  id: string;
  user: User;
  word: Word;
  repetitions: number;
  easinessFactor: number;
  nextRepetition: Date;
}
