FROM node:20-alpine AS builder
WORKDIR /app

COPY tsconfig*.json ./
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Instalar apenas as deps da API directamente
WORKDIR /app/apps/api
RUN npm install

WORKDIR /app
COPY apps/api/ ./apps/api/

WORKDIR /app/apps/api
RUN npm run build

FROM node:20-alpine
WORKDIR /app/apps/api

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/apps/api/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "dist/main.js"]
