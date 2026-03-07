# Story 06 — Tareas de desarrollo

> Nota: La transicion a fase `move` ya esta implementada en Stories 04/05. El `ADJACENCY` list ya existe en `board.ts`. Esta story se centra en la logica de movimiento, la seleccion de fichas en el cliente, y la deteccion de bloqueo.

## DEV-01: Funcion para obtener movimientos validos de una ficha

- Crear funcion `getValidMoves(board: BoardCell[], position: number): number[]` en `src/lib/board.ts`
- Devuelve las posiciones adyacentes vacias a las que se puede mover la ficha en `position`
- Usa `ADJACENCY[position]` y filtra por `board[adj] === null`

**Tests:**
- Test: devuelve posiciones adyacentes vacias
- Test: no devuelve posiciones ocupadas
- Test: devuelve array vacio si todas las adyacentes estan ocupadas (ficha bloqueada)

## DEV-02: Funcion para detectar jugador bloqueado

- Crear funcion `isPlayerBlocked(board: BoardCell[], playerKey: PlayerKey): boolean` en `src/lib/board.ts`
- Un jugador esta bloqueado si NINGUNA de sus fichas tiene movimientos validos
- Se usa para determinar fin de partida tras un movimiento

**Tests:**
- Test: devuelve `false` si al menos una ficha tiene un movimiento valido
- Test: devuelve `true` si todas las fichas del jugador estan bloqueadas
- Test: devuelve `false` si el jugador no tiene fichas en el tablero

## DEV-03: Logica de movimiento de ficha

- Crear funcion `movePiece(game: Game, from: number, to: number, playerKey: PlayerKey): MoveResult` en `src/lib/game-actions.ts`
- `MoveResult = { ok: true; mill: boolean } | { ok: false; error: string }`
- Validaciones:
  - La partida debe estar en status `playing`
  - La fase debe ser `move` (o `fly` — sera Story 07)
  - El `turnState` debe ser `move`
  - Es el turno del jugador (`game.turn === playerKey`)
  - `from` y `to` son posiciones validas (0-23)
  - `from` tiene una ficha propia
  - `to` esta vacia
  - `to` es adyacente a `from` (en fase `move`; en fase `fly` se salta esta validacion)
- Si es valido:
  - Mover la ficha: `board[from] = null`, `board[to] = playerKey`
  - Comprobar si forma molino en la posicion destino (`checkMill(board, to, playerKey)`)
  - Si molino: `turnState = "remove"`, turno se mantiene
  - Si no molino: cambiar turno al rival, `turnState = "move"`
  - Tras cambiar turno, comprobar si el rival esta bloqueado (`isPlayerBlocked`) → si lo esta, `status = "finished"`, `winner = playerKey`
- Devolver resultado

**Tests:**
- Test: mover ficha a posicion adyacente vacia — ficha se mueve correctamente
- Test: `from` queda vacio y `to` tiene la ficha del jugador
- Test: el turno pasa al rival tras mover (sin molino)
- Test: no se puede mover a posicion no adyacente
- Test: no se puede mover ficha del rival
- Test: no se puede mover a posicion ocupada
- Test: no se puede mover si no es tu turno
- Test: no se puede mover si `turnState` no es `move`
- Test: no se puede mover si la fase no es `move`
- Test: detecta molino tras mover y pone `turnState = "remove"`
- Test: si tras mover el rival queda bloqueado, la partida termina
- Test: posiciones invalidas (< 0, > 23, no enteros) son rechazadas

## DEV-04: API de movimiento de ficha

- Crear endpoint `POST /api/games/{code}/move`
- Body: `{ from: number, to: number, playerId: string }`
- Validar que el playerId corresponde al jugador con turno
- Llamar a `movePiece()` y devolver estado actualizado
- Respuestas:
  - 200: `{ board, turn, phase, turnState, player1, player2, status, winner, mill }`
  - 400: movimiento invalido (no adyacente, ficha rival, posicion ocupada, etc.)
  - 404: partida no encontrada
  - 409: no estas en fase de movimiento

**Tests:**
- Test: `POST /api/games/{code}/move` con movimiento valido devuelve 200
- Test: devuelve 400 si mueves a posicion no adyacente
- Test: devuelve 409 si la fase no es `move`
- Test: devuelve 404 para partida inexistente

## DEV-05: Actualizar Board para modo movimiento (seleccion de ficha)

- El Board necesita un flujo de dos pasos en fase `move`:
  1. **Paso 1 — Seleccionar ficha**: las fichas propias son clicables. Al hacer click, la ficha se resalta como "seleccionada" y se muestran las posiciones adyacentes vacias como destinos.
  2. **Paso 2 — Seleccionar destino**: al hacer click en una posicion destino valida, se envia `POST /api/games/{code}/move` con `from` y `to`.
- Si el jugador hace click en otra ficha propia, cambia la seleccion.
- Si el jugador hace click en la ficha seleccionada, la deselecciona.
- Si el jugador hace click en una posicion invalida, no pasa nada (o muestra feedback breve).
- Todo el estado de seleccion es **client-side** (no requiere cambios en el servidor).
- Atributos data necesarios: `data-owner` (player1/player2/empty), `data-adjacent` (lista de adyacentes vacias).
- La seleccion se gestiona con JavaScript: al seleccionar una ficha, se anade clase CSS a la ficha y a las posiciones destino.

**Tests:**
- Test (unit): en modo `move`, las fichas propias tienen `data-clickable="true"`
- Test (unit): al hacer click en ficha propia, se envia fetch a `/api/games/{code}/move` con from y to

## DEV-06: Actualizar indicador de fase en GameInfo

- Cuando `phase === "move"`, el badge de fase muestra "Movimiento"
- Verificar que ya funciona con el mapeo existente `phaseLabels`

> Nota: `GameInfo.astro` ya tiene `phaseLabels = { place: "Colocacion", move: "Movimiento", fly: "Vuelo" }` — solo verificar que se muestra correctamente.
