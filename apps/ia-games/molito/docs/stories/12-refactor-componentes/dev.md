# Story 12 — Tareas de desarrollo

## DEV-01: Extraer componentes de pantallas de estado ✅

- Crear `GameNotFound.astro` — card con icono, titulo "Partida no encontrada", boton "Volver al inicio"
- Crear `GameFull.astro` — card con icono, titulo "Partida llena", boton "Volver al inicio"
- Crear `GameFinished.astro` — card para visitantes no-jugadores cuando la partida termino
- Reemplazar los bloques inline en `[code].astro` por estos componentes

## DEV-02: Extraer AutoJoinScreen.astro ✅

- Mover las 3 sub-pantallas (auto-join-screen, join-error-screen, join-success-screen) a `AutoJoinScreen.astro`
- Mover el `<script>` de auto-join (`attemptAutoJoin`) al componente
- Mover el `<style>` de `animate-progress` al componente
- Props: `code: string`

## DEV-03: Extraer DisconnectBanner.astro ✅

- Mover el banner de desconexion y el boton "Reclamar victoria" a su propio componente
- Mover el `<script>` de claim-victory al componente
- Props: `code: string`, `playerId: string`

## DEV-04: Extraer GamePlayingLayout.astro ✅

- Crear componente que compone DisconnectBanner + Board + GameInfo en el layout de dos columnas
- Reutilizarlo tanto para estado "playing" como para "finished" (con overlay de GameResult)
- Props: los mismos que Board + GameInfo necesitan, mas `disabled: boolean` para el estado finished

## DEV-05: Extraer SSE a modulo independiente ✅

- Crear `src/lib/sse-client.ts` con la logica de conexion SSE, reconnect y disconnect detection
- Exportar una funcion `initSSE(config)` que reciba gameCode, playerId, playerKey y callbacks
- El `<script>` en `[code].astro` solo llama a `initSSE()` con los parametros del DOM

## DEV-06: Extraer api-helpers.ts ✅

- Crear `src/lib/api-helpers.ts` con:
  - `parseJsonBody(request)` — parsea body JSON con manejo de errores
  - `resolvePlayer(game, playerId)` — retorna playerKey o null
  - `requireGame(code)` — retorna game o Response 404
  - `requirePlayer(game, playerId)` — retorna playerKey o Response 403
- Refactorizar los 7 endpoints para usar estos helpers
- Reducir la duplicacion de validacion en cada endpoint

## DEV-07: Limpiar [code].astro ✅

- Verificar que `[code].astro` queda como orquestador: solo importa componentes y decide cual mostrar segun estado
- Eliminar todo HTML inline, scripts y styles que se hayan movido a componentes
- Resultado: 132 lineas (380 → 132, -65%). Incluye frontmatter, template limpio y script SSE minimo
