# Story 08 — Tareas de desarrollo

> Nota: La deteccion de fin de partida ya esta implementada: `removePiece` detecta < 3 fichas, `movePiece` detecta bloqueo del rival. El modelo ya tiene `status: "finished"` y `winner`. El trabajo principal es la pantalla de resultado y la determinacion del motivo de victoria.

## DEV-01: Agregar motivo de victoria al modelo

- Agregar campo `winReason` a `Game`: `"elimination" | "block" | null`
- Setear en `removePiece` cuando rival queda con < 3 fichas: `winReason = "elimination"`
- Setear en `movePiece` cuando rival queda bloqueado: `winReason = "block"`
- Tests: verificar que `winReason` se setea correctamente en ambos casos

## DEV-02: Crear componente GameResult

- Nuevo componente `GameResult.astro` con overlay sobre el tablero
- Props: `winner`, `playerKey`, `winReason`, `code`
- Muestra "Has ganado!" o "Has perdido" segun perspectiva del jugador
- Muestra motivo: "Tu rival se ha quedado sin fichas" / "Tu rival no puede mover"
- Boton "Nueva partida" → POST `/api/games` y redirect a sala de espera
- Boton "Volver al inicio" → link a `/`

## DEV-03: Integrar GameResult en la pagina de partida

- En `[code].astro`, cuando `game.status === "finished"`, mostrar Board + GameResult overlay
- El tablero se muestra con estado final pero sin interaccion
- Pasar `winner`, `playerKey`, `winReason`, `code` a GameResult

## DEV-04: Endpoint para obtener estado de partida

- Verificar que `/api/games/{code}/status` (o polling existente) incluye `status`, `winner` y `winReason`
- Asegurar que ambos jugadores reciben la info de fin de partida
