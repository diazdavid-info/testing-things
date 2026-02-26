# Stage 1: Build
FROM node:24-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy only this app's package.json for dependency caching
COPY apps/qr-scanner/package.json apps/qr-scanner/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy app source
COPY apps/qr-scanner apps/qr-scanner

# Build
RUN pnpm --filter qr-scanner build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/apps/qr-scanner/dist /usr/share/nginx/html

# SPA fallback: redirect all routes to index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
