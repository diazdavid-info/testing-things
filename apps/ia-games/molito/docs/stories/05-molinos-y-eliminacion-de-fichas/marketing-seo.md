# Story 05 — Tareas de marketing y SEO

## ~~MKT-01: Copywriting de eliminacion de fichas~~ ✅

- Molino propio formado: "Molino! Elimina una ficha rival"
- Molino del rival: "El rival ha formado un molino"
- Indicador durante eliminacion rival: "El rival esta eliminando una ficha..."
- Error ficha en molino: "No puedes eliminar una ficha que esta en un molino"
- Error ficha propia: "Solo puedes eliminar fichas del rival"
- Error posicion vacia: "Selecciona una ficha del rival"
- Partida terminada por eliminacion: "Victoria! Tu rival se ha quedado sin fichas"

> Todos los textos implementados en `game-actions.ts` y `GameInfo.astro`.

## ~~MKT-02: Eventos de analytics~~ ✅

- Nuevos eventos:
  - `mill_formed` — ya definido en Story 04, ahora se dispara realmente
  - `piece_removed` — ficha eliminada (con `position`, `player_who_removed`, `pieces_remaining_rival`)
  - `invalid_remove_attempt` — intento de eliminacion invalido (con `reason`)
  - `game_ended_by_elimination` — partida terminada porque un jugador se quedo sin fichas

> Eventos definidos en `src/lib/analytics-events.ts` con tipos TypeScript.
