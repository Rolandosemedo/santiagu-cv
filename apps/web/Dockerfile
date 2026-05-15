FROM node:20-alpine
RUN npm install -g pnpm@9

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY pnpm-lock.yaml ./

RUN pnpm install --no-frozen-lockfile

COPY packages/types/ ./packages/types/
COPY apps/web/ ./apps/web/

WORKDIR /app/apps/web
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
