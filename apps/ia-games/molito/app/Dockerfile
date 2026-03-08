# Build stage
FROM node:22-alpine AS build

RUN npm install -g pnpm

WORKDIR /app

# Copy only the app's package.json and install dependencies
COPY apps/ia-games/molito/app/package.json ./
RUN pnpm install --no-frozen-lockfile

# Copy app source and build
COPY apps/ia-games/molito/app/ .
RUN pnpm run build

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
