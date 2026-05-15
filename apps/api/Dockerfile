FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@9

COPY apps/api/package*.json ./apps/api/
COPY package.json ./
RUN cd apps/api && pnpm install

COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/src ./apps/api/src

WORKDIR /app/apps/api
RUN pnpm run build

FROM node:22-alpine
WORKDIR /app/apps/api

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./

EXPOSE 3001
CMD ["node", "dist/server.js"]
