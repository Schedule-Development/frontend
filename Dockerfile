FROM node:20-slim AS builder

# Install build essentials for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 make g++ gcc build-essential sqlite3 libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN pnpm build

# Runtime image

FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y \
    python3 make g++ gcc build-essential sqlite3 libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --no-frozen-lockfile

COPY . .

ENV NODE_OPTIONS=--max-old-space-size=4096
RUN pnpm build

# Runtime image
FROM node:20-slim

RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
