# Story 06 — Tareas de marketing y SEO

## ~~MKT-01: Copywriting de fase de movimiento~~ ✅

- Indicador de fase: "Movimiento" (ya existe en phaseLabels)
- Antes de seleccionar ficha: "Tu turno — Selecciona una ficha para mover"
- Tras seleccionar ficha: "Selecciona una posicion destino"
- Error mover a posicion no adyacente: "Solo puedes mover a posiciones adyacentes"
- Error posicion ocupada: "Esa posicion ya esta ocupada"
- Error ficha rival: "Solo puedes mover tus fichas"
- Error fuera de turno: "Espera tu turno"
- Partida terminada por bloqueo: "Victoria! Tu rival no tiene movimientos disponibles"
- Turno del rival: "Turno del rival" (ya existe)

> Todos los textos implementados en `game-actions.ts` y Board/GameInfo components.

## ~~MKT-02: Eventos de analytics~~ ✅

- Nuevos eventos:
  - `piece_moved` — ficha movida (con `from`, `to`, `player`)
  - `piece_selected` — ficha seleccionada para mover (client-side)
  - `piece_deselected` — ficha deseleccionada (client-side)
  - `invalid_move_attempt` — ya definido en Story 04, ahora tambien cubre movimientos
  - `game_ended_by_block` — partida terminada porque un jugador quedo bloqueado

> Eventos definidos en `src/lib/analytics-events.ts` con tipos TypeScript.
