FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ bash

RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile

EXPOSE 4200

CMD ["pnpm", "nx", "serve", "frontend", "--host", "0.0.0.0"]
