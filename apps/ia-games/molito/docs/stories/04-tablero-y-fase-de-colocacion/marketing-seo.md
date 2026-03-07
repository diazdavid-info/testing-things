# Story 04 — Tareas de marketing y SEO

## ~~SEO-01: Metadatos de la pagina de juego~~ ✅

- Actualizar `<title>` cuando la partida esta en `playing`:
  - "Jugando — Partida {code} — El Molino"
- `<meta description>`: "Partida de El Molino en curso. Fase de colocacion."

> Title y description ya dinamicos en `[code].astro` segun estado de partida.

## ~~MKT-01: Copywriting del tablero y panel~~ ✅

- Indicador turno propio: "Tu turno"
- Indicador turno rival: "Turno del rival"
- Fase colocacion: "Colocacion"
- Fichas por colocar: "Por colocar: X"
- Fichas en tablero: "En tablero: X"
- Error posicion ocupada: "Esa posicion ya esta ocupada"
- Error fuera de turno: "Espera tu turno"
- Jugador labels: "Jugador 1" / "Jugador 2"

> Todo implementado en `GameInfo.astro` y `game-actions.ts`.

## ~~MKT-02: Eventos de analytics~~ ✅

- Nuevos eventos:
  - `game_board_view` — el jugador ve el tablero por primera vez
  - `piece_placed` — ficha colocada
  - `phase_changed` — cambio de fase
  - `mill_formed` — se formo un molino
  - `invalid_move_attempt` — intento de movimiento invalido

> Eventos definidos en `src/lib/analytics-events.ts` con tipos TypeScript.
