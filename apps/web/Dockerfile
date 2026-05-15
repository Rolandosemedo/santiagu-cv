FROM node:20-alpine
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/

RUN pnpm install --frozen-lockfile

COPY packages/types/ ./packages/types/
COPY apps/web/ ./apps/web/

WORKDIR /app/apps/web
RUN pnpm build

EXPOSE 3000
CMD ["node", "server.js"]
