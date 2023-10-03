import type { Question } from '@/domain/model/question'
import type { Answer } from '@/domain/model/answer'
import type { ApiClient } from '@/domain/apiClient'

export const createApi = () => {
  function getToken(): string | null {
    const token = sessionStorage.getItem('token')
    if (token == null) {
      throw new Error('Token is not set')
    }
    return token
  }

  const client: ApiClient = {
    async getQuestion(): Promise<Question> {
      const response = await fetch('/api/learning/next-question', {
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      })

      return await response.json()
    },

    async sendAnswer(answer: Answer): Promise<void> {
      await fetch('/api/learning/answer', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      })
    }
  }

  return {
    client
  }
}
