# Story 07 — Tareas de marketing y SEO

## MKT-01: Copywriting de fase de vuelo

- Indicador de fase: "Vuelo" (ya existe en phaseLabels)
- Mensaje turno volando: "Tu turno — Vuelo: mueve a cualquier posicion"
- Mensaje rival volando: "El rival esta volando..."
- Badge junto a jugador: "Vuelo"

## MKT-02: Eventos de analytics

- Nuevos eventos:
  - `fly_phase_entered` — un jugador entra en fase de vuelo (con `player`, `pieces_remaining`)
  - `piece_flew` — ficha movida en vuelo (con `from`, `to`, `player`)
