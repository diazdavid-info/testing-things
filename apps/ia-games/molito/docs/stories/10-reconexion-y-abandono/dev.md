# Story 10 — Tareas de desarrollo

> Nota: La reconexion basica ya funciona — las cookies `playerId_{code}` persisten y la pagina del juego reconoce al jugador. El SSE reconecta automaticamente. El trabajo principal es detectar desconexion del rival, mostrar avisos, y permitir reclamar victoria.

## DEV-01: Tracking de conexion de jugadores

- Agregar `lastSeen: { player1: number | null, player2: number | null }` al Game (timestamps)
- Actualizar `lastSeen` cuando un jugador se conecta al SSE stream
- Cuando un jugador se desconecta del SSE, no actualizar mas su timestamp
- Crear funcion `isPlayerDisconnected(game, playerKey, gracePeriodMs = 15000): boolean`

## DEV-02: Notificacion de desconexion al rival

- En el stream SSE, incluir campo `connected: { player1: boolean, player2: boolean }` en cada evento
- El cliente muestra banner "Tu rival se ha desconectado" cuando `connected[rivalKey]` es false
- El banner desaparece automaticamente cuando el rival reconecta
- Periodo de gracia de 15 segundos antes de mostrar aviso

## DEV-03: Reclamar victoria por abandono

- Endpoint `POST /api/games/{code}/claim-victory` con body `{ playerId }`
- Validaciones: partida en curso, jugador valido, rival desconectado por mas de 5 minutos
- Setea `status: "finished"`, `winner: playerKey`, `winReason: "abandon"`
- Agregar "abandon" al tipo `WinReason`
- Tests: claim exitoso, claim rechazado si rival esta conectado

## DEV-04: UI de reclamar victoria

- Despues de que el banner de desconexion este visible por 5 minutos, mostrar boton "Reclamar victoria"
- Al pulsar, enviar POST a `/api/games/{code}/claim-victory`
- Si exitoso, recargar para mostrar pantalla de resultado
