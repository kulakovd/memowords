import { inject } from 'vue'
import type { ApiClient } from '@/domain/apiClient'

export function injectApi() {
  const api = inject<ApiClient>('api')

  if (api === undefined) {
    throw new Error('api is not provided')
  }

  return api
}
