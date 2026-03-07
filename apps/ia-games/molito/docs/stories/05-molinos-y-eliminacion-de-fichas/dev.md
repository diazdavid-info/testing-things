# Story 05 — Tareas de desarrollo

> Nota: La deteccion de molinos (`checkMill`) y el cambio de `turnState` a `"remove"` ya estan implementados en Story 04. Esta story se centra en la logica de eliminacion de fichas y el feedback visual.

## ~~DEV-01: Logica de eliminacion de ficha rival~~ ✅

- Crear funcion `removePiece(game: Game, position: number, playerKey: PlayerKey): RemoveResult` en `src/lib/game-actions.ts`
- Validaciones:
  - La partida debe estar en status `playing`
  - El `turnState` debe ser `"remove"`
  - Es el turno del jugador (`game.turn === playerKey`)
  - La posicion tiene una ficha del rival (no vacia, no propia)
  - La posicion es valida (0-23)
  - La ficha NO forma parte de un molino activo del rival, EXCEPTO si todas las fichas del rival estan en molinos
- Si es valido:
  - Retirar la ficha del tablero (`board[position] = null`)
  - Decrementar `piecesOnBoard` del rival
  - Cambiar el turno al otro jugador
  - Restaurar `turnState` segun la fase actual (`"place"` si fase `place`, `"move"` si fase `move`)
  - Comprobar si el rival queda con menos de 3 fichas y no le quedan por colocar → `status = "finished"`, asignar `winner`
  - Si ambos jugadores han agotado fichas por colocar y estabamos en fase `place`, transicionar a fase `move`
- Devolver resultado: `{ ok: true }` o `{ ok: false, error: string }`

> Implementado en `src/lib/game-actions.ts`. 11 tests en `remove-piece.test.ts`.

## ~~DEV-02: Funcion para obtener fichas eliminables~~ ✅

- Crear funcion `getRemovablePositions(game: Game, playerKey: PlayerKey): number[]` en `src/lib/board.ts`
- Devuelve las posiciones del rival que pueden ser eliminadas:
  - Fichas del rival que NO estan en molino activo
  - Si todas estan en molino, devolver todas las fichas del rival
- Esta funcion se usa tanto en el servidor (validacion) como en el cliente (resaltar fichas eliminables)

> Implementado en `src/lib/board.ts`. 4 tests en `remove-piece.test.ts`.

## ~~DEV-03: API de eliminacion de ficha~~ ✅

- Crear endpoint `POST /api/games/{code}/remove`
- Body: `{ position: number, playerId: string }`
- Validar que el playerId corresponde al jugador con turno y que `turnState === "remove"`
- Llamar a `removePiece()` y devolver estado actualizado
- Respuestas:
  - 200: `{ board, turn, phase, turnState, player1, player2, status, winner }`
  - 400: posicion invalida, ficha propia, ficha en molino, etc.
  - 404: partida no encontrada
  - 409: no estas en estado de eliminacion

> Implementado en `src/pages/api/games/[code]/remove.ts`. 6 tests en `api-remove.test.ts`.

## ~~DEV-04: Actualizar Board para modo eliminacion~~ ✅

- Cuando `turnState === "remove"` y es tu turno:
  - Las fichas rivales eliminables se resaltan (borde pulsante, color diferente)
  - Las fichas rivales en molino activo se muestran con opacidad reducida (no clicables)
  - Las posiciones vacias y fichas propias NO son clicables
  - Al hacer click en una ficha eliminable, enviar `POST /api/games/{code}/remove`
- Mostrar mensaje: "Molino! Elimina una ficha rival"
- Si el turno es del rival y `turnState === "remove"`, mostrar "El rival esta eliminando una ficha"

> Board.astro actualizado con `getRemovablePositions`, anillos dorados pulsantes, opacidad reducida para protegidas. GameInfo.astro actualizado con mensajes de molino y banner rojo.

## ~~DEV-05: Resaltado visual del molino formado~~ ✅

- Cuando se detecta un molino (respuesta de `/place` o `/move` con `mill: true`):
  - Identificar las 3 posiciones del molino recien formado
  - Resaltarlas brevemente (borde dorado o animacion pulse durante ~1.5s)
- Crear funcion `getFormedMills(board, position, playerKey): number[][]` que devuelve los molinos completados en esa posicion

> `getFormedMills` implementado en `src/lib/board.ts`. 3 tests en `remove-piece.test.ts`.
