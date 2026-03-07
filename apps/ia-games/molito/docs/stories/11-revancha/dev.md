# Story 11 — Tareas de desarrollo

## DEV-01: Modelo de revancha ✅

- Agregar campos a Game: `rematchRequested: { player1: boolean, player2: boolean }`, `rematchGameCode: string | null`
- Cuando ambos son true, crear nueva partida y setear `rematchGameCode`
- La nueva partida reutiliza los mismos playerIds
- El perdedor de la anterior tiene primer turno

## DEV-02: Endpoint de revancha ✅

- `POST /api/games/{code}/rematch` con body `{ playerId }`
- Marca `rematchRequested[playerKey] = true`
- Si ambos han solicitado: crea nueva partida, retorna `{ rematchCode }`
- Si solo uno: retorna `{ waiting: true }`
- Notifica via SSE para que el otro jugador vea la propuesta

## DEV-03: Actualizar GameResult con boton de revancha ✅

- Reemplazar "Nueva partida" por "Revancha" en GameResult
- Mantener "Volver al inicio"
- Al pulsar "Revancha": POST a `/api/games/{code}/rematch`
- Si exitoso y waiting: mostrar "Esperando respuesta del rival..."
- Si exitoso y rematchCode: redirect a nueva partida
- SSE notifica cuando rival acepta → redirect automatico

## DEV-04: Manejo de rechazo de revancha ✅

- Si el rival pulsa "Volver al inicio", el SSE deja de enviar updates
- No se implementa notificacion explicita de rechazo (simplemente el rival se va)
- Timeout: si no hay respuesta en 60s, el boton muestra "Tu rival no ha respondido"
