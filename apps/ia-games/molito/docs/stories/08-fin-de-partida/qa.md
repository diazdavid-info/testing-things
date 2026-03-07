# Story 08 — Tareas de QA

## ~~QA-01: Tests de winReason~~ ✅

- Test: `winReason` es "elimination" cuando rival queda con < 3 fichas
- Test: `winReason` es "block" cuando rival queda bloqueado
- Test: `winReason` es null cuando partida no ha terminado

> 3 tests en `game-end.test.ts`. Todos pasan.

## ~~QA-02: Tests de integracion~~ ✅

- Verificado que pagina de partida terminada renderiza GameResult overlay
- Board con opacity 50% y pointer-events-none

> Verificado en `[code].astro`.

## ~~QA-03: Tests visuales~~ ✅

- Verificado en frames Pencil: victory, defeat y mobile
- Tablero no interactivo tras fin de partida

> Frames S08 en Pencil.
