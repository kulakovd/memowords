import type { Question } from '@/domain/model/question'
import type { Answer } from '@/domain/model/answer'

export interface ApiClient {
  getQuestion(): Promise<Question>
  sendAnswer(answer: Answer): Promise<void>
}
