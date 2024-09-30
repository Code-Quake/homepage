# Stage 1: Builder (install dependencies)

FROM oven/bun:latest AS builder

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install

# Stage 2: Final Image (copy code and configure environment)

FROM oven/bun:latest

ENV NODE_ENV=production

CMD [ "bun", "start-https" ]

COPY --from=builder /usr/src/app/node_modules/ .