/**
 * Types for Telegram Web App.
 * This interface describes the API of the Telegram Web App partially including only the methods that are used in the app.
 * See full API here: https://core.telegram.org/bots/webapps#initializing-mini-apps
 */
interface TelegramWebApp {
  initData: string
  HapticFeedback: {
    notificationOccurred(type: 'success' | 'error' | 'warning'): void
  }
}
