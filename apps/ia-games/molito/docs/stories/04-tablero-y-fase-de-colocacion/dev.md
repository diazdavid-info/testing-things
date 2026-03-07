# Story 04 — Tareas de desarrollo

## ~~DEV-01: Topologia del tablero y constantes~~ ✅

> Implementado en `src/lib/board.ts`. 24 posiciones, adyacencias simetricas, 16 molinos, `checkMill()`. Tests en `test/board.test.ts` (12 tests).


- Definir en `src/lib/board.ts` la topologia del tablero del Molino:
  - `POSITIONS`: array de 24 posiciones con coordenadas (x, y) para renderizar el tablero (grid logico, no pixeles)
  - `ADJACENCY`: mapa de adyacencias — para cada posicion, que posiciones estan conectadas (necesario para Story 06)
  - `MILLS`: array de todos los molinos posibles (tripletas de indices). Hay 16 molinos en el tablero clasico
- Las posiciones siguen la numeracion estandar del molino:
  - Cuadrado exterior (0-7), cuadrado medio (8-15), cuadrado interior (16-23)
  - Los puntos medios conectan los cuadrados entre si
- Exportar como constantes inmutables

**Tests:**
- Test: `POSITIONS` tiene exactamente 24 entradas
- Test: `ADJACENCY` — cada posicion tiene entre 2 y 4 vecinos
- Test: `MILLS` tiene exactamente 16 tripletas
- Test: cada posicion aparece en al menos 2 molinos
- Test: las adyacencias son simetricas (si A es vecino de B, B es vecino de A)

## ~~DEV-02: Logica de colocacion de ficha~~ ✅

> Implementado en `src/lib/game-actions.ts`. `placePiece()` con todas las validaciones, cambio de turno, deteccion de molino, transicion a fase `move`. Tests en `test/game-actions.test.ts` (13 tests).


- Crear funcion `placePiece(game: Game, position: number, playerKey: PlayerKey): PlaceResult` en `src/lib/game-actions.ts`
- Validaciones:
  - La partida debe estar en status `playing` y phase `place`
  - Es el turno del jugador (`game.turn === playerKey`)
  - El jugador tiene fichas por colocar (`piecesToPlace > 0`)
  - La posicion esta vacia (`board[position] === null`)
  - La posicion es valida (0-23)
- Si es valido:
  - Colocar la ficha en el tablero (`board[position] = playerKey`)
  - Decrementar `piecesToPlace` e incrementar `piecesOnBoard` del jugador
  - Comprobar si se formo un molino (ver DEV-03)
  - Si NO se formo molino, cambiar el turno al otro jugador
  - Si SE formo molino, cambiar `turnState` a `"remove"` (se resuelve en Story 05)
  - Si ambos jugadores han colocado todas las fichas (piecesToPlace === 0 para ambos), transicionar `phase` a `"move"`
- Devolver resultado: `{ ok: true, mill: boolean }` o `{ ok: false, error: string }`

**Tests:**
- Test: colocar ficha en posicion vacia — exito, ficha aparece en board
- Test: colocar ficha reduce `piecesToPlace` e incrementa `piecesOnBoard`
- Test: colocar ficha cambia el turno al otro jugador
- Test: no se puede colocar en posicion ocupada
- Test: no se puede colocar fuera de turno
- Test: no se puede colocar si no hay fichas pendientes
- Test: no se puede colocar si la partida no esta en fase `place`
- Test: posicion fuera de rango (negativa, >23) es rechazada
- Test: cuando ambos agotan fichas, la fase cambia a `move`

## ~~DEV-03: Deteccion de molinos~~ ✅

> Implementado en `src/lib/board.ts` como `checkMill()`. Usa mapa precalculado `POSITION_MILLS` para solo comprobar molinos relevantes. Tests en `test/board.test.ts`.


- Crear funcion `checkMill(board: BoardCell[], position: number, playerKey: PlayerKey): boolean` en `src/lib/board.ts`
- Dado un tablero y una posicion recien colocada, comprobar si esa posicion forma parte de un molino completo
- Un molino es una linea de 3 fichas del mismo jugador en una de las 16 lineas definidas en `MILLS`
- Solo comprobar los molinos que incluyen la posicion recien colocada (optimizacion)

**Tests:**
- Test: detectar molino horizontal en cuadrado exterior
- Test: detectar molino vertical en cuadrado exterior
- Test: detectar molino en linea que cruza cuadrados
- Test: no detectar molino con fichas mezcladas
- Test: no detectar molino incompleto (solo 2 fichas)

## ~~DEV-04: API de colocacion de ficha~~ ✅

> Implementado en `src/pages/api/games/[code]/place.ts`. Valida playerId, llama a `placePiece()`, devuelve estado actualizado. Tests en `test/api-place.test.ts` (7 tests).


- Crear endpoint `POST /api/games/{code}/place`
- Body: `{ position: number, playerId: string }`
- Validar que el playerId corresponde al jugador con el turno actual
- Llamar a `placePiece()` y devolver el estado actualizado del juego
- Respuestas:
  - 200: `{ board, turn, phase, turnState, player1, player2, mill: boolean }`
  - 400: posicion invalida o fuera de turno
  - 404: partida no encontrada
  - 409: partida no esta en fase de colocacion

**Tests:**
- Test: `POST /api/games/{code}/place` con posicion valida devuelve 200 y board actualizado
- Test: devuelve 400 si es turno del otro jugador
- Test: devuelve 400 si la posicion esta ocupada
- Test: devuelve 404 para codigo inexistente
- Test: devuelve 409 si la partida no esta en `playing`

## ~~DEV-05: Componente del tablero (Board)~~ ✅

> Implementado en `src/components/Board.astro`. SVG con 3 cuadrados, lineas de conexion, 24 posiciones interactivas. Click envia fetch a API. Soporte teclado. Aria-labels.


- Crear `src/components/Board.astro` (o `.tsx` si necesita interactividad compleja)
- Renderizar el tablero clasico del Molino con SVG:
  - 3 cuadrados concentricos (lineas)
  - 4 lineas conectando los puntos medios de los cuadrados
  - 24 circulos interactivos en las intersecciones
- Cada posicion muestra:
  - Circulo vacio (gris claro) si no hay ficha
  - Ficha de color del jugador 1 (amber/warm) si hay ficha de player1
  - Ficha de color del jugador 2 (dark/contraste) si hay ficha de player2
- Las posiciones validas (vacias + turno del jugador) tienen cursor pointer y hover
- Al hacer click en una posicion vacia, enviar `POST /api/games/{code}/place`
- Props: `board`, `turn`, `phase`, `playerKey` (quien es el jugador local), `code`

**Tests:**
- Test: el SVG renderiza 24 posiciones
- Test: las posiciones vacias son clicables cuando es tu turno
- Test: las posiciones ocupadas no son clicables
- Test: al hacer click se envia fetch a la API

## ~~DEV-06: Panel de informacion de partida (GameInfo)~~ ✅

> Implementado en `src/components/GameInfo.astro`. Indicador de turno, fase, contadores por jugador. Responsive con colores del design system.


- Crear `src/components/GameInfo.astro`
- Mostrar:
  - Indicador de turno: "Tu turno" o "Turno del rival" con color/icono
  - Fase actual: "Colocacion" (localizado)
  - Fichas por colocar de cada jugador (barras o numeros)
  - Fichas en tablero de cada jugador
- El panel se adapta a mobile (debajo del tablero) y desktop (al lado)
- Props: `turn`, `phase`, `playerKey`, `player1`, `player2`

**Tests:**
- Test: muestra "Tu turno" cuando es el turno del jugador local
- Test: muestra "Turno del rival" cuando no es su turno
- Test: muestra la fase "Colocacion" correctamente
- Test: muestra los contadores de fichas correctos

## ~~DEV-07: Pagina de juego — integrar tablero y panel~~ ✅

> Integrado en `src/pages/molino/[code].astro`. Layout flex con Board + GameInfo. Responsive: horizontal en desktop, vertical en mobile.


- Modificar `src/pages/molino/[code].astro` para reemplazar el placeholder de "Partida en curso" con:
  - Componente Board
  - Componente GameInfo
- Pasar los datos del juego (board, turn, phase, players) desde el servidor
- El componente cliente hace polling o recibe updates para mantener el estado sincronizado
- Por ahora, polling cada 2s a `GET /api/games/{code}/state` (endpoint nuevo que devuelve todo el estado)

**Tests:**
- Test: la pagina de juego renderiza el tablero cuando la partida esta en `playing`
- Test: los datos iniciales del juego se pasan correctamente al componente

## ~~DEV-08: API de estado completo de la partida~~ ✅

> Implementado en `src/pages/api/games/[code]/state.ts`. Devuelve board, turn, phase, turnState, status, players. Valida cookie de jugador. Tests en `test/api-place.test.ts` (3 tests).


- Crear endpoint `GET /api/games/{code}/state`
- Devuelve el estado completo: `{ board, turn, phase, turnState, player1, player2, status }`
- Solo accesible por los jugadores de la partida (validar cookie)
- Respuestas:
  - 200: estado completo
  - 403: no eres jugador de esta partida
  - 404: partida no encontrada

**Tests:**
- Test: devuelve estado completo con board, turn, phase, players
- Test: devuelve 404 para codigo inexistente
- Test: devuelve 403 para un visitante sin cookie de jugador
