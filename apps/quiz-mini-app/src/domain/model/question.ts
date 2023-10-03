import type { Word } from '@/domain/model/word'

export interface Question {
  options: Word[]
  correctOption: Word['id']
}
