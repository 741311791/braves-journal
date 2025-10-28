FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

RUN corepack enable pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm --filter=@braves-journal/api build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 apiuser

COPY --from=builder --chown=apiuser:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=apiuser:nodejs /app/apps/api/package.json ./package.json
COPY --from=deps --chown=apiuser:nodejs /app/node_modules ./node_modules

USER apiuser

EXPOSE 3001

ENV PORT=3001

CMD ["node", "dist/index.js"]
