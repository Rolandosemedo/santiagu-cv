FROM node:20-alpine
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

RUN pnpm install --frozen-lockfile

COPY packages/types/ ./packages/types/
COPY apps/api/ ./apps/api/

WORKDIR /app/apps/api
RUN pnpm build

EXPOSE 3001
CMD ["node", "dist/index.js"]
