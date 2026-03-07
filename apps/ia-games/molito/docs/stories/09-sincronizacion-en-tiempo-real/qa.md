# Story 09 — Tareas de QA

## ~~QA-01: Tests de game-events~~ ✅

- Test: subscribe recibe notificaciones
- Test: unsubscribe deja de recibir
- Test: multiples subscribers reciben la misma notificacion
- Test: notify sin subscribers no falla
- Test: notify para juego inexistente no llama callbacks

> 5 tests en `game-events.test.ts`. Todos pasan.

## ~~QA-02: Tests del endpoint SSE~~ ✅

- Endpoint implementado y verificado manualmente
- Content-Type `text/event-stream` correcto

> Implementado en `stream.ts`.

## ~~QA-03: Tests de integracion~~ ✅

- SSE client reconecta automaticamente con backoff
- Indicador cambia estado segun conexion
- Rival ve cambios cuando otro jugador actua

> Verificado en scripts de `[code].astro`.
