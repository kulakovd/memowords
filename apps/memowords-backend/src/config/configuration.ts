import * as process from 'process';

export default () => ({
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? 'secret',
});
