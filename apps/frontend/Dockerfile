FROM node:24-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile

EXPOSE 4200

CMD ["pnpm", "--filter", "@tmdigital/frontend", "start"]
