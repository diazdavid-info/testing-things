# Story 13: Preparar para produccion — Dockerfile para Coolify

## Descripcion

La aplicacion necesita un Dockerfile optimizado para desplegarse en Coolify. Astro con `@astrojs/node` en modo `standalone` genera un servidor Node autocontenido en `dist/server/entry.mjs`. El Dockerfile debe ser multi-stage, ligero y listo para produccion.

## Requisitos

### Dockerfile

- Multi-stage build: stage de build (instalar deps + build) y stage de runtime
- Imagen base: `node:22-alpine` (la mas ligera con soporte LTS)
- Usar pnpm como package manager (el monorepo ya usa pnpm)
- Copiar solo `dist/` y las dependencias de produccion al stage final
- Exponer puerto configurable via variable de entorno `PORT` (default 4321, que es el de Astro)
- Definir `HOST=0.0.0.0` para que escuche en todas las interfaces
- Healthcheck basico con `wget` o `curl` al endpoint raiz
- `.dockerignore` para excluir node_modules, .git, tests, docs, .pen files
- El build context es `apps/ia-games/molito/app/` (no la raiz del monorepo)

### Variables de entorno

- `PORT` — puerto del servidor (default 4321)
- `HOST` — host de escucha (default 0.0.0.0)
- No hay secrets ni API keys ya que no hay servicios externos ni base de datos

### Validacion

- `docker build -t molino .` completa sin errores
- `docker run -p 4321:4321 molino` sirve la app correctamente
- La imagen final pesa menos de 200MB

## Criterios de aceptacion

- Dockerfile funcional en el directorio de la app
- `.dockerignore` presente
- La app arranca y sirve paginas correctamente desde el contenedor
- Todos los 162 tests siguen pasando (el Dockerfile no afecta el codigo)

## Fuera de alcance

- CI/CD pipeline (Coolify se conecta directo al repo)
- Configuracion de dominio o SSL (Coolify lo maneja)
- Docker Compose
- Base de datos o persistencia (el juego usa memoria, es efimero por diseno)
