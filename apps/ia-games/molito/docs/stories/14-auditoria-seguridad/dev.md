# Story 14 — Tareas de desarrollo

## DEV-01: Auditar validacion de input en APIs

- Revisar que todos los endpoints validan tipos estrictos (number para position/from/to, string para playerId)
- Verificar rechazo de posiciones fuera de rango, decimales, NaN, Infinity
- Verificar rechazo de payloads vacios, nulls, arrays donde se esperan objetos
- Anadir validacion estricta donde falte

## DEV-02: Auditar cookies y autenticacion

- Revisar atributos de la cookie `playerId_{code}`: anadir `HttpOnly` y `Secure` en produccion
- Verificar que `SameSite=Lax` esta presente (ya lo esta en join.ts)
- Evaluar si `Path` deberia ser `/molino/{code}` en vez de `/`

## DEV-03: Auditar SSE y filtracion de datos

- Revisar que el stream no expone playerIds en el payload
- Verificar que un tercero sin cookie puede conectarse al SSE pero no obtiene datos privilegiados
- Evaluar limitar conexiones SSE por IP o game

## DEV-04: Anadir headers de seguridad

- Agregar middleware o configuracion de Astro con headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Verificar que no hay XSS en contenido renderizado

## DEV-05: Evaluar rate limiting y abuso

- Documentar riesgos: creacion masiva de partidas, spam de movimientos
- Evaluar si se necesita rate limiting (puede ser a nivel de Coolify/reverse proxy)
- Verificar entropia de codigos de partida (4 chars × 31 opciones = ~20 bits)

## DEV-06: Generar informe de hallazgos

- Documentar cada vulnerabilidad encontrada, severidad y accion tomada
- Crear `docs/security-audit.md` con el informe
