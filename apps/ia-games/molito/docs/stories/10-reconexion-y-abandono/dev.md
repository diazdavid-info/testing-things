# Story 10 — Tareas de desarrollo

## ~~DEV-01: Tracking de conexion de jugadores~~ ✅

- Campo `lastSeen: { player1: number | null, player2: number | null }` en Game
- Actualizado en SSE stream al conectar y cada 10s via heartbeat
- Grace period de 15s para determinar desconexion

> Implementado en `game.ts` y `stream.ts`.

## ~~DEV-02: Notificacion de desconexion al rival~~ ✅

- SSE incluye `connected: { player1, player2 }` en cada evento
- Cliente muestra banner "Tu rival se ha desconectado" cuando rival no conectado
- Banner desaparece al reconectar

> Implementado en `stream.ts` y `[code].astro`.

## ~~DEV-03: Reclamar victoria por abandono~~ ✅

- Endpoint `POST /api/games/{code}/claim-victory`
- Valida: partida en curso, rival desconectado 5+ minutos
- `winReason: "abandon"` agregado al tipo `WinReason`

> Implementado en `claim-victory.ts`. 6 tests en `claim-victory.test.ts`.

## ~~DEV-04: UI de reclamar victoria~~ ✅

- Banner con boton "Reclamar victoria" visible despues de 5 min
- Click envia POST a claim-victory y recarga

> Implementado en `[code].astro` con banner y script.
