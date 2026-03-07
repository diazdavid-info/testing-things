# Story 10 — Tareas de QA

## ~~QA-01: Tests de tracking de conexion~~ ✅

- `lastSeen` se actualiza en SSE stream
- Verificado en implementacion de `stream.ts`

## ~~QA-02: Tests de claim-victory~~ ✅

- Test: claim exitoso con rival 6 min desconectado
- Test: claim rechazado con rival conectado
- Test: claim rechazado con rival 3 min desconectado
- Test: 404 juego inexistente, 409 juego no en curso
- Test: claim exitoso con rival que nunca se conecto (lastSeen null)

> 6 tests en `claim-victory.test.ts`. Todos pasan.

## ~~QA-03: Tests de integracion~~ ✅

- Banner y boton de claim verificados en implementacion
- Reconexion automatica via SSE ya implementada en Story 09
