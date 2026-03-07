# Story 08 — Tareas de desarrollo

> Nota: La deteccion de fin de partida ya esta implementada: `removePiece` detecta < 3 fichas, `movePiece` detecta bloqueo del rival. El modelo ya tiene `status: "finished"` y `winner`. El trabajo principal es la pantalla de resultado y la determinacion del motivo de victoria.

## ~~DEV-01: Agregar motivo de victoria al modelo~~ ✅

- Campo `winReason: "elimination" | "block" | null` agregado a `Game`
- Seteado en `removePiece` (elimination) y `movePiece` (block)

> Implementado en `game.ts` y `game-actions.ts`. 3 tests en `game-end.test.ts`.

## ~~DEV-02: Crear componente GameResult~~ ✅

- Componente `GameResult.astro` con overlay fijo sobre el tablero
- Muestra icono, titulo (ganado/perdido), motivo, botones
- Textos por perspectiva del jugador y motivo de victoria

> Implementado en `GameResult.astro`.

## ~~DEV-03: Integrar GameResult en la pagina de partida~~ ✅

- Cuando `game.status === "finished"` y es jugador conocido: muestra tablero (opacidad 50%, sin interaccion) + overlay GameResult
- Cuando es espectador: muestra pantalla simple de "Partida terminada"

> Implementado en `[code].astro`.

## ~~DEV-04: Endpoint para obtener estado de partida~~ ✅

- APIs `/move` y `/remove` ahora incluyen `winReason` en sus respuestas

> Implementado en `move.ts` y `remove.ts`.
