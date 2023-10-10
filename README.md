# memowords

The app is available at https://t.me/memowordsbot/app

This is a Telegram mini-app designed to help you memorize English words
using a simplified version of the SM2 algorithm for spaced repetition. 
Words will appear at varying frequencies based on how well you're able to remember them.

See `apps/memowords-backend/src/learning/learning.service.ts` for details on how the algorithm works.

## Setup telegram bot (both for local development and production)

Use [BotFather](https://t.me/botfather) to perform the following steps:
1. Create a new bot
2. Create web app
3. For local development, use `https://memobot.dmku.local/` as URL for the app
4. Setup menu button to open web app. For local development, use `https://memobot.dmku.local/`

## Local development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/) (version 20 or higher)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)

### Running the bot locally

Since telegram requires to use HTTPS, 
we need to configure it for local development using Caddy container.
The configuration file for Caddy is located in `Caddyfile.dev` file.

First create a volumes for Caddy and Postgres
```sh
docker volume create memowords-caddy-data
docker volume create memowords-pg-data-local
```

Then run the following command to start Caddy and Postgres containers
```sh
docker-compose -f docker-compose.dev.yaml up -d
```

Run frontend (Mini App)
```sh
cd apps/quiz-mini-app
yarn dev
```

Go to backend directory `apps/memowords-backend` and create `.env` file with the following variables:
```
TELEGRAM_BOT_TOKEN=<your telegram bot token>
```

Prepare database
```sh
cd apps/memowords-backend
yarn schema:sync
yarn migration:up
```

Run backend
```sh
cd apps/memowords-backend
yarn start:dev
```

### Setting up access via HTTPS

Follow the instructions in [Caddy documentation](https://caddyserver.com/docs/running#local-https-with-docker) 
to set up certificates for local development.

Then add domain name `memobot.dmku.local` to your `/etc/hosts` file or use any local DNS server.

## Production

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the bot in production

Before running the bot, you need to create a `.env` file in the root directory of the project. This file should contain the following variables:
```
TELEGRAM_BOT_TOKEN=<your telegram bot token>
ACCESS_TOKEN_SECRET=<your access token secret>
POSTGRES_PASSWORD=<your postgres password>
```

Create a volume for the postgres database:
```sh
docker volume create memowords-pg-data
```

Create a network to connect the app and upstanding web server:
```sh
docker network create memowords
```

To run the bot, execute the following command:
```sh
docker-compose up -d
```

### Web server

This configuration implies that you have a web server running on the host machine that proxies requests to the bot and terminates TLS.
For example, you can use [Caddy](https://caddyserver.com/) for this purpose.

Use network `memowords` to connect your web server to the bot.
Bot will be available at `http://memowords-entrypoint:3000` inside the network.

With Caddy you can use the following configuration:
```
<your domain> {
    reverse_proxy memowords-entrypoint:3000
}
```

And Caddy will automatically generate and renew certificates for your domain using [Let's Encrypt](https://letsencrypt.org/).
