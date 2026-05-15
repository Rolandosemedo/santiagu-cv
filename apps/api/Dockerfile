FROM node:20-alpine AS builder
WORKDIR /app

# Copiar TODOS os tsconfig da raiz e dos packages
COPY tsconfig*.json ./
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Instalar dependências
RUN npm install --workspace=apps/api

# Copiar código da API
COPY apps/api/ ./apps/api/

# Build dentro da pasta correcta
WORKDIR /app/apps/api
RUN npm run build

# --- Runtime ---
FROM node:20-alpine
WORKDIR /app/apps/api

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules ../../node_modules

RUN npm install --omit=dev

EXPOSE 3001
CMD ["node", "dist/main.js"]
