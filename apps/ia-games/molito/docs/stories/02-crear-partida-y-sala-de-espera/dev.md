# Story 02 — Tareas de desarrollo

## DEV-01: Modelo de datos y persistencia de partida

- Definir el modelo `Game` en `src/lib/game.ts`:
  - `id: string` (UUID)
  - `code: string` (4 caracteres alfanumericos)
  - `status: "waiting" | "playing" | "finished"`
  - `player1: Player`
  - `player2: Player | null`
  - `board: (null | "player1" | "player2")[]` (24 posiciones)
  - `phase: "place" | "move" | "fly"`
  - `turn: "player1" | "player2"`
  - `turnState: "place" | "move" | "remove"`
  - `winner: "player1" | "player2" | null`
  - `createdAt: string` (ISO timestamp)
- Definir el modelo `Player`:
  - `id: string` (UUID)
  - `piecesToPlace: number` (inicia en 9)
  - `piecesOnBoard: number` (inicia en 0)
- Crear un store en memoria (`Map<string, Game>`) como persistencia temporal
- Funciones: `createGame(): Game`, `getGameByCode(code): Game | null`, `getGameById(id): Game | null`
- Generar codigos unicos verificando que no existan duplicados en el store

**Tests:**
- Test: `createGame` devuelve un Game con estado `waiting`, board vacio (24 nulls), player1 asignado
- Test: `getGameByCode` devuelve el game correcto o null
- Test: los codigos generados son unicos (crear 100 partidas, verificar no duplicados)
- Test: el player1 tiene `piecesToPlace: 9` y `piecesOnBoard: 0`

## DEV-02: API real de creacion de partida

- Reemplazar el stub de `POST /api/games` con la implementacion real
- Llamar a `createGame()` del store
- Devolver `{ id, code, playerId }` donde `playerId` es el id del player1
- Guardar el `playerId` del jugador (se usara para identificarlo via cookie o parametro)

**Tests:**
- Test: `POST /api/games` crea una partida en el store
- Test: la respuesta contiene `id`, `code` y `playerId` validos
- Test: la partida creada tiene status `waiting`
- Test: el code tiene 4 caracteres alfanumericos

## DEV-03: Pagina de sala de espera

- Crear la ruta `src/pages/molino/[code].astro`
- Al acceder, buscar la partida por codigo en el store
- Si la partida no existe, mostrar mensaje "Partida no encontrada" con link para volver al inicio
- Si la partida existe y esta en `waiting`, renderizar la sala de espera
- Si la partida existe y esta en `playing`, renderizar el tablero (placeholder por ahora)
- La pagina recibe el `code` como parametro de la URL

**Tests:**
- Test: acceder a `/molino/ABCD` con partida existente en `waiting` renderiza sala de espera
- Test: acceder a `/molino/XXXX` sin partida devuelve mensaje de error

## DEV-04: Componente sala de espera

- Crear `src/components/WaitingRoom.astro`
- Mostrar el codigo de partida en grande y destacado (font monospace o heading grande)
- Boton "Copiar link" que copia `{origin}/molino/{code}` al portapapeles
- Boton "Copiar codigo" que copia el codigo al portapapeles
- Al copiar, el texto del boton cambia temporalmente a "Copiado!" durante 2 segundos
- Mostrar indicador "Esperando jugador..." con animacion CSS (puntos suspensivos o pulse)
- Boton "Volver al inicio" como accion secundaria

**Tests:**
- Test: al pulsar "Copiar link", se llama a `navigator.clipboard.writeText` con la URL correcta
- Test: al pulsar "Copiar codigo", se llama a `navigator.clipboard.writeText` con el codigo
- Test: tras copiar, el texto del boton cambia a "Copiado!" y vuelve al original tras 2s
- Test: el codigo de partida se muestra en pantalla
- Test: el indicador "Esperando jugador..." esta visible

## DEV-05: Polling o WebSocket para detectar union del rival

- Implementar polling cada 3 segundos a `GET /api/games/{code}/status`
- El endpoint devuelve `{ status: "waiting" | "playing" | "finished" }`
- Cuando el status cambia a `playing`, redirigir automaticamente al tablero (o recargar la pagina)
- Detener el polling cuando se detecta el cambio o cuando el usuario abandona la pagina
- Alternativa: preparar estructura para WebSocket (se implementara en Story 09)

**Tests:**
- Test: el polling se inicia al cargar la sala de espera
- Test: cuando el status cambia a `playing`, se redirige
- Test: el polling se detiene al abandonar la pagina (cleanup)

## DEV-06: API de estado de partida

- Crear endpoint `GET /api/games/{code}/status`
- Devuelve `{ status, playerCount }` donde `playerCount` es 1 o 2
- Si la partida no existe, devuelve 404

**Tests:**
- Test: `GET /api/games/{code}/status` devuelve status correcto para partida en `waiting`
- Test: devuelve 404 para codigo inexistente
