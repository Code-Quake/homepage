FROM oven/bun:latest

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
COPY ./.next/standalone/ ./
RUN bun install sharp -g

ENV NODE_ENV production

CMD [ "bun", "server.js" ]