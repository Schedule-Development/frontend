FROM node:20-slim AS builder

# Install build essentials for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 make g++ gcc build-essential sqlite3 \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN pnpm build

# Runtime image
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/.output .output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
