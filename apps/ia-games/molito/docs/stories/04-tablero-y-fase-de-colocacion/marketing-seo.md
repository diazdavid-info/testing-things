# Story 04 — Tareas de marketing y SEO

## SEO-01: Metadatos de la pagina de juego

- Actualizar `<title>` cuando la partida esta en `playing`:
  - "Jugando — Partida {code} — El Molino"
- `<meta description>`: "Partida de El Molino en curso. Fase de colocacion."
- Estos metadatos no son criticos (la pagina no se comparte una vez en juego) pero mantienen coherencia

## MKT-01: Copywriting del tablero y panel

- Indicador turno propio: "Tu turno"
- Indicador turno rival: "Turno del rival"
- Fase colocacion: "Colocacion"
- Fichas por colocar: "Por colocar: X"
- Fichas en tablero: "En tablero: X"
- Error posicion ocupada: "Esa posicion ya esta ocupada"
- Error fuera de turno: "Espera tu turno"
- Jugador 1 label: "Jugador 1" (o nombre si se implementa)
- Jugador 2 label: "Jugador 2"

## MKT-02: Eventos de analytics

- Nuevos eventos:
  - `game_board_view` — el jugador ve el tablero por primera vez
  - `piece_placed` — ficha colocada (con `position`, `player`, `pieces_remaining`)
  - `phase_changed` — cambio de fase (con `from`, `to`)
  - `mill_formed` — se formo un molino (con `player`, `positions`)
  - `invalid_move_attempt` — intento de movimiento invalido (con `reason`)
