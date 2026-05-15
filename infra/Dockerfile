# ── Build stage ──────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copiar manifests (monorepo)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# Instalar deps
RUN pnpm install --frozen-lockfile

# Copiar código-fonte
COPY apps/api ./apps/api
COPY packages/types ./packages/types

# Build TypeScript
RUN pnpm --filter @santiagu/api build

# ── Production stage ──────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

# Apenas produção
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

RUN pnpm install --frozen-lockfile --prod

# Copiar build
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/types ./packages/types

# Utilizador não-root
RUN addgroup -g 1001 -S nodejs && adduser -S fastify -u 1001
USER fastify

EXPOSE 3001
ENV PORT=3001 NODE_ENV=production

CMD ["node", "apps/api/dist/server.js"]
