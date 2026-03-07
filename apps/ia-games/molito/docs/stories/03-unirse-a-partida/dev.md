# Story 03 — Tareas de desarrollo

> Nota: La API de join (`POST /api/games/{code}/join`), el formulario `JoinGameForm.astro`, y las validaciones (404, 409, 410) ya estan implementados en Story 02. Esta story se centra en el flujo de union por link directo y la identidad de jugadores.

## DEV-01: Identidad de jugador via cookie

- Al crear una partida (`POST /api/games`), guardar el `playerId` en una cookie `playerId_{code}` (httpOnly, sameSite: lax)
- Al unirse via formulario (join exitoso), guardar la cookie `playerId_{code}` con el playerId devuelto
- Al acceder a `/molino/{code}`, leer la cookie para identificar si el visitante es player1, player2 o un nuevo jugador
- Esto permite distinguir al creador de la partida de un visitante nuevo cuando ambos acceden a la misma URL

**Tests:**
- Test: tras crear una partida, la respuesta incluye header `Set-Cookie` con el playerId
- Test: tras join exitoso via formulario, se guarda la cookie del playerId
- Test: al acceder a `/molino/{code}`, se identifica correctamente al jugador

## DEV-02: Auto-join al abrir link directo

- Si un jugador nuevo (sin cookie de esa partida) accede a `/molino/{code}` y la partida esta en `waiting`:
  - Llamar automaticamente a `POST /api/games/{code}/join` desde el cliente
  - Si el join es exitoso, guardar cookie y recargar la pagina (ahora vera el tablero)
- Si el jugador ya es player1 (tiene cookie), mostrar la sala de espera normalmente
- Si la partida esta en `playing` y el jugador es player1 o player2, mostrar el tablero
- Si la partida esta en `playing` y es un tercero, mostrar "Partida llena"

**Tests:**
- Test: un visitante nuevo en partida `waiting` dispara auto-join automatico
- Test: player1 (con cookie) ve la sala de espera sin auto-join
- Test: player2 accediendo de nuevo a la URL no intenta re-join
- Test: un tercero en partida `playing` ve mensaje "Partida llena"

## DEV-03: Flujo completo de redireccion tras join por formulario

- Actualmente el formulario redirige a `/molino/{code}` tras join exitoso
- Verificar que al llegar a esa URL, el jugador 2 (con cookie ya guardada) ve el estado correcto:
  - Si `playing`, muestra placeholder del tablero
  - No vuelve a intentar join
- Asegurar que la cookie se escribe ANTES de la redireccion

**Tests:**
- Test: flujo e2e — crear partida, join via formulario, verificar redireccion y estado final
- Test: la cookie se establece antes de `window.location.href`

## DEV-04: Notificacion al jugador 1 y transicion

- El polling de la sala de espera ya detecta el cambio a `playing` y recarga la pagina
- Verificar que tras recargar, player1 (con cookie) ve el tablero y no la sala de espera
- Asegurar que el mensaje "Jugador conectado!" se muestra brevemente antes del reload

**Tests:**
- Test: player1 con cookie, partida en `playing`, ve el tablero (no la sala de espera)
- Test: el indicador cambia a "Jugador conectado!" antes del reload

## DEV-05: Proteccion contra uniones duplicadas

- Si player1 intenta unirse a su propia partida (via formulario con su propio codigo), la API devuelve 409
- Si alguien intenta unirse despues de que player2 ya esta, la API devuelve 409
- Si se hacen 2 peticiones de join simultaneas, solo una debe tener exito (race condition)
- Anadir un lock simple en `joinGame()` para prevenir race conditions

**Tests:**
- Test: player1 no puede unirse a su propia partida via formulario
- Test: dos llamadas simultaneas a join, solo una tiene exito
- Test: tras join exitoso, siguientes intentos devuelven 409
