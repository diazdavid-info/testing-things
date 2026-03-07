# Story 07 — Tareas de desarrollo

> Nota: `movePiece()` ya soporta `fly` phase (no valida adyacencia cuando `game.phase === "fly"`). El API `/move` ya acepta `fly`. El trabajo principal es la transicion automatica a fase `fly` y la adaptacion del Board para vuelo.

## DEV-01: Transicion automatica a fase de vuelo

- Despues de cada eliminacion de ficha (`removePiece`), si el rival queda con exactamente 3 fichas y 0 por colocar, cambiar `game.phase` a `"fly"`
- La fase de vuelo es **global** en el modelo actual (un solo `game.phase`), pero la logica de `movePiece` ya permite vuelo para cualquier jugador cuando `phase === "fly"`
- Tambien verificar en `movePiece`: despues de mover, si el rival queda bloqueado pero tiene exactamente 3 fichas, NO terminar partida (en vuelo no hay bloqueo)
- Agregar funcion helper `shouldEnterFlyPhase(game): boolean` en `board.ts`
- Tests: transicion correcta en `removePiece`, no transicion con 4+ fichas, no transicion si quedan fichas por colocar

## DEV-02: Logica de vuelo individual por jugador

- Problema: el modelo actual tiene un solo `game.phase` global. Pero vuelo es individual — un jugador puede volar mientras el otro se mueve normalmente.
- Solucion: Usar `game.phase = "fly"` cuando **cualquier** jugador tiene 3 fichas. En `movePiece`, determinar si el jugador actual puede volar: `player.piecesOnBoard === 3 && player.piecesToPlace === 0`.
- Si el jugador puede volar, saltar la validacion de adyacencia (ya implementado cuando `phase === "fly"`, pero necesita cambiar a validacion per-player).
- Actualizar `movePiece` para verificar vuelo per-player en lugar de depender solo de `game.phase`.
- Actualizar `isPlayerBlocked` para que retorne `false` si el jugador tiene 3 fichas (puede volar).
- Tests: jugador con 3 fichas puede mover a cualquier posicion; jugador con 4+ fichas solo adyacentes en misma partida.

## DEV-03: Actualizar Board para modo vuelo

- Cuando el jugador actual esta en vuelo (3 fichas, 0 por colocar), al seleccionar una ficha:
  - Todas las posiciones vacias son destinos validos (no solo adyacentes)
  - El `data-adjacent` debe contener todas las posiciones vacias
- Calcular `isFlying` en Board.astro: `playerKey's piecesOnBoard === 3 && piecesToPlace === 0 && phase is move or fly`
- Si `isFlying`, cambiar calculo de `adjacentEmpty` para incluir todas posiciones vacias
- Tests manuales: verificar que al seleccionar ficha en vuelo se resaltan todas las vacias

## DEV-04: Actualizar GameInfo para mostrar vuelo individual

- Mostrar indicador de vuelo por jugador en GameInfo cuando un jugador tiene 3 fichas
- Agregar badge "Vuelo" junto al nombre del jugador que esta volando
- Mensaje de turno: "Tu turno — Vuelo" cuando el jugador actual puede volar
