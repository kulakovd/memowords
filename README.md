# memowords

This is a telegram mini app that helps you to memorize words in a foreign language.
It implements simplified SM2 algorithm for spaced repetition.

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

To run the bot, execute the following command:
```sh
docker-compose up -d
```

This configuration implies that you have a web server running on the host machine that proxies requests to the bot and terminates TLS. 
For example, you can use [Caddy](https://caddyserver.com/) for this purpose.
