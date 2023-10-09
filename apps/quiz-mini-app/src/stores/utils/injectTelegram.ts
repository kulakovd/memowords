import { inject } from 'vue'

export const injectTelegram = () => {
  const telegram = inject<TelegramWebApp>('telegram')

  if (telegram === undefined) {
    throw new Error('telegram is not provided')
  }

  return telegram
}
