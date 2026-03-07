# Story 06 — Tareas de desarrollo

> Nota: La transicion a fase `move` ya esta implementada en Stories 04/05. El `ADJACENCY` list ya existe en `board.ts`. Esta story se centra en la logica de movimiento, la seleccion de fichas en el cliente, y la deteccion de bloqueo.

## ~~DEV-01: Funcion para obtener movimientos validos de una ficha~~ ✅

- Crear funcion `getValidMoves(board: BoardCell[], position: number): number[]` en `src/lib/board.ts`
- Devuelve las posiciones adyacentes vacias a las que se puede mover la ficha en `position`
- Usa `ADJACENCY[position]` y filtra por `board[adj] === null`

> Implementado en `board.ts`. 3 tests en `move-piece.test.ts`.

## ~~DEV-02: Funcion para detectar jugador bloqueado~~ ✅

- Crear funcion `isPlayerBlocked(board: BoardCell[], playerKey: PlayerKey): boolean` en `src/lib/board.ts`
- Un jugador esta bloqueado si NINGUNA de sus fichas tiene movimientos validos

> Implementado en `board.ts`. 3 tests en `move-piece.test.ts`.

## ~~DEV-03: Logica de movimiento de ficha~~ ✅

- Crear funcion `movePiece(game: Game, from: number, to: number, playerKey: PlayerKey): MoveResult` en `src/lib/game-actions.ts`
- Validaciones completas: status, phase, turnState, turn, posiciones validas, adyacencia, ficha propia, destino vacio
- Detecta molinos tras mover y bloqueo del rival

> Implementado en `game-actions.ts`. 11 tests en `move-piece.test.ts`.

## ~~DEV-04: API de movimiento de ficha~~ ✅

- Endpoint `POST /api/games/{code}/move` con body `{ from, to, playerId }`
- Respuestas: 200, 400, 404, 409

> Implementado en `src/pages/api/games/[code]/move.ts`. 4 tests en `api-move.test.ts`.

## ~~DEV-05: Actualizar Board para modo movimiento (seleccion de ficha)~~ ✅

- Flujo de dos pasos client-side: seleccionar ficha → seleccionar destino
- Fichas propias con `data-action="select"` y `data-adjacent` con movimientos validos
- CSS: `.selected-piece` con glow, `.valid-dest` con verde
- Click en otra ficha propia cambia seleccion, click en misma deselecciona
- Keyboard support actualizado

> Board.astro actualizado con seleccion client-side, estilos CSS, y envio a `/api/games/{code}/move`.

## ~~DEV-06: Actualizar indicador de fase en GameInfo~~ ✅

- `phaseLabels` ya incluye `move: "Movimiento"` — verificado que funciona.

> Ya existia en GameInfo.astro, sin cambios necesarios.
