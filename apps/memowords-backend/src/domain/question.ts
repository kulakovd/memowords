import { Word } from './word';

export interface Question {
  options: Word[];
  correctOption: Word['id'];
}
