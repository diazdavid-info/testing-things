# Story 13 — Tareas de desarrollo

## DEV-01: Crear Dockerfile multi-stage ✅

- Stage 1 (build): node:22-alpine, instalar pnpm, copiar package.json + lockfile, instalar deps, copiar src, `pnpm build`
- Stage 2 (runtime): node:22-alpine, copiar `dist/` desde stage de build, copiar `node_modules/` de produccion
- Entrypoint: `node dist/server/entry.mjs`
- Variables: `HOST=0.0.0.0`, `PORT=4321`
- Healthcheck con wget al puerto

## DEV-02: Crear .dockerignore ✅

- Excluir: node_modules, .git, dist, docs, tests, *.pen, .env*, .DS_Store
- Mantener solo lo necesario para el build

## DEV-03: Validar build de Docker ✅

- Verificar que `docker build` completa sin errores
- Verificar que `docker run` sirve la app
- Verificar que la imagen pesa menos de 200MB
