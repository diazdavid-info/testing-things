# Story 07 — Tareas de desarrollo

> Nota: `movePiece()` ya soporta `fly` phase (no valida adyacencia cuando `game.phase === "fly"`). El API `/move` ya acepta `fly`. El trabajo principal es la transicion automatica a fase `fly` y la adaptacion del Board para vuelo.

## ~~DEV-01: Transicion automatica a fase de vuelo~~ ✅

- Despues de cada eliminacion de ficha (`removePiece`), si el rival queda con exactamente 3 fichas y 0 por colocar, cambiar `game.phase` a `"fly"`
- La fase de vuelo es **global** en el modelo actual (un solo `game.phase`), pero la logica de `movePiece` ya permite vuelo para cualquier jugador cuando `phase === "fly"`
- Tambien verificar en `movePiece`: despues de mover, si el rival queda bloqueado pero tiene exactamente 3 fichas, NO terminar partida (en vuelo no hay bloqueo)
- Agregar funcion helper `canPlayerFly(piecesOnBoard, piecesToPlace): boolean` en `board.ts`
- Tests: transicion correcta en `removePiece`, no transicion con 4+ fichas, no transicion si quedan fichas por colocar

> Implementado en `game-actions.ts` (removePiece) y `board.ts` (canPlayerFly). 2 tests en `fly-phase.test.ts`.

## ~~DEV-02: Logica de vuelo individual por jugador~~ ✅

- Solucion: `movePiece` ahora verifica vuelo per-player con `canPlayerFly(player.piecesOnBoard, player.piecesToPlace)` en vez de depender solo de `game.phase`.
- `isPlayerBlocked` retorna `false` para jugadores con 3 fichas (pueden volar).
- Tests: jugador con 3 fichas puede mover a cualquier posicion; jugador con 4+ fichas solo adyacentes.

> Implementado en `game-actions.ts` y `board.ts`. 5 tests en `fly-phase.test.ts`.

## ~~DEV-03: Actualizar Board para modo vuelo~~ ✅

- Board.astro recibe nueva prop `currentPlayer` para calcular `isFlying`
- Cuando `isFlying`, `data-adjacent` contiene todas las posiciones vacias del tablero
- Page `[code].astro` pasa `currentPlayer` a Board

> Implementado en `Board.astro` y `[code].astro`.

## ~~DEV-04: Actualizar GameInfo para mostrar vuelo individual~~ ✅

- Badge "Vuelo" junto al nombre del jugador que esta volando
- Mensaje "Tu turno — Vuelo" cuando el jugador actual puede volar
- Calculo per-player: `p1Flying` y `p2Flying`

> Implementado en `GameInfo.astro`.
