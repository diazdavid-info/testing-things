# Story 12: Refactor — Componentizacion de codigo y disenos

## Descripcion

El archivo `[code].astro` ha crecido a 380 lineas con bloques HTML inline repetidos (pantallas de error, auto-join, partida llena, partida terminada) y un bloque `<script>` monolitico de 145 lineas que mezcla SSE, auto-join y claim-victory. En Pencil, los 30 frames no comparten componentes reutilizables — cada pantalla duplica cards, botones y paneles.

Este refactor extrae componentes Astro reutilizables y crea componentes Pencil reutilizables, sin cambiar funcionalidad ni estilos.

## Requisitos

### Codigo — Extraer componentes Astro

- Extraer `AutoJoinScreen.astro` con las tres sub-pantallas (loading, error, success)
- Extraer `GameNotFound.astro` para la pantalla de "Partida no encontrada"
- Extraer `GameFull.astro` para "Partida llena"
- Extraer `GameFinished.astro` para "Partida terminada" (visitante no-jugador)
- Extraer `DisconnectBanner.astro` para el banner de desconexion + boton claim victory
- Extraer `GamePlayingLayout.astro` que compone Board + GameInfo + DisconnectBanner (usado en playing y finished)
- Mover la logica de SSE del `<script>` inline a un archivo `src/lib/sse-client.ts` importado como modulo
- Mover la logica de auto-join a `AutoJoinScreen.astro`
- Mover la logica de claim-victory a `DisconnectBanner.astro`
- `[code].astro` debe quedar como orquestador limpio: solo logica de routing por estado del juego

### Codigo — Limpiar API endpoints

- Los 7 endpoints API repiten el patron: parsear body, buscar juego, validar jugador. Extraer un helper `parseGameRequest(params, request)` que retorne `{ game, playerKey }` o un `Response` de error
- Mover la validacion comun a `src/lib/api-helpers.ts`

### Pencil — Crear componentes reutilizables

- Crear componente "Card" reutilizable (bg-surface, border, rounded-2xl, padding)
- Crear componente "PrimaryButton" reutilizable
- Crear componente "SecondaryButton" reutilizable
- Crear componente "StatusMessage" (icono + titulo + descripcion centrados)
- Refactorizar las pantallas existentes para usar estos componentes

## Criterios de aceptacion

- `[code].astro` baja de ~380 lineas a menos de 80
- Todos los 162 tests siguen pasando sin modificacion
- Ningun cambio visual — la UI es identica antes y despues
- Los componentes Pencil son marcados como reutilizables

## Fuera de alcance

- Cambios de estilo o mejoras visuales
- Nuevas funcionalidades
- Migracion a framework de componentes (React, Svelte, etc.)
