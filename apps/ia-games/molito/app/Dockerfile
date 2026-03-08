# Build stage
FROM node:22-alpine AS build

RUN npm install -g pnpm

WORKDIR /app

# Copy package files for dependency installation
COPY package.json ./
RUN pnpm install --no-frozen-lockfile

# Copy source and build
COPY . .
RUN npx astro build

# Runtime stage
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy built output and production dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

CMD ["node", "dist/server/entry.mjs"]
