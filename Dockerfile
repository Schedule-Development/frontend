
FROM node:20-slim AS builder

# 1. Instalando dependências de compilação

RUN apt-get update && apt-get install -y \
    python3 make g++ gcc build-essential sqlite3 libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# 2. Instalando dependências com npm
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# 3. Recompila o SQLite especificamente para este ambiente Linux
RUN npm rebuild better-sqlite3

ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# --- Runtime image ---
FROM node:20-slim

# Instala apenas o necessário para rodar
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia os resultados do build
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production

# Exponha a porta se necessário (ex: 3000)
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]