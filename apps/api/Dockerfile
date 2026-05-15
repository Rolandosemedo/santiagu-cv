FROM node:20-alpine AS builder
WORKDIR /app

# Copiar tsconfig da raiz (necessário para o extends do monorepo)
COPY tsconfig*.json ./
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Instalar dependências
RUN npm install --workspace=apps/api

# Copiar código da API
COPY apps/api/ ./apps/api/

# Build — manter WORKDIR na raiz para o extends funcionar
RUN npx tsc -p apps/api/tsconfig.json

# --- Runtime ---
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/main.js"]
