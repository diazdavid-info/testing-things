# Story 09 — Tareas de desarrollo

> Nota: Actualmente el cliente hace `window.location.reload()` tras cada accion exitosa. El rival no ve cambios hasta que tambien recarga. Esta story reemplaza el reload por SSE (Server-Sent Events) para sincronizacion en tiempo real.

## DEV-01: Crear sistema de eventos del juego (pub/sub en memoria)

- Crear `src/lib/game-events.ts` con un EventEmitter simple para notificar cambios
- `subscribe(code: string, callback: (state) => void): () => void` — subscribe y retorna unsubscribe
- `notify(code: string)` — emite el estado actual del juego a todos los subscribers
- Llamar `notify` desde los endpoints de `place`, `move`, `remove` despues de accion exitosa

## DEV-02: Crear endpoint SSE para streaming de estado

- Endpoint `GET /api/games/{code}/stream` que retorna `text/event-stream`
- Se suscribe al sistema de eventos del juego
- Envia `data: {estado_del_juego}` cada vez que hay un cambio
- Maneja cleanup cuando el cliente cierra la conexion
- Envia heartbeat cada 30s para mantener la conexion

## DEV-03: Actualizar cliente para usar SSE en vez de reload

- En Board.astro, tras enviar accion exitosa: NO recargar pagina
- En su lugar, escuchar SSE en el cliente y actualizar DOM cuando llega nuevo estado
- Crear funcion `applyGameState(state)` que actualiza tablero, info panel, turno
- Conectar al SSE al cargar la pagina del juego

## DEV-04: Actualizar sala de espera para usar SSE

- En WaitingRoom: conectar al SSE para detectar cuando el rival se une
- Cuando llega `status: "playing"`, redirigir automaticamente al tablero
- Reemplazar el polling actual (si existe) por SSE

## DEV-05: Indicador de conexion

- Mostrar indicador verde sutil cuando SSE esta conectado
- Mostrar "Reconectando..." cuando la conexion se pierde
- Auto-reconectar con backoff exponencial
