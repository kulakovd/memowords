FROM node:20-alpine as backend-builder

WORKDIR /app
COPY apps/memowords-backend/package.json apps/memowords-backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY apps/memowords-backend .
RUN yarn build
RUN yarn install --frozen-lockfile --production

FROM node:20-alpine as frontend-builder

WORKDIR /app
COPY apps/quiz-mini-app/package.json apps/quiz-mini-app/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY apps/quiz-mini-app .
RUN yarn build

FROM node:20-alpine

WORKDIR /dist
COPY --from=backend-builder /app/dist .
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package.json .
COPY --from=frontend-builder /app/dist ./public

EXPOSE 3000

CMD ["yarn", "prod:start"]
