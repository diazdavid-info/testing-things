# Story 09 — Tareas de desarrollo

> Nota: Actualmente el cliente hace `window.location.reload()` tras cada accion exitosa. El rival no ve cambios hasta que tambien recarga. Esta story agrega SSE (Server-Sent Events) para sincronizacion en tiempo real.

## ~~DEV-01: Crear sistema de eventos del juego (pub/sub en memoria)~~ ✅

- `game-events.ts` con `subscribe(code, callback)` y `notify(code)`
- `notify` llamado desde endpoints de `place`, `move`, `remove`, `join`

> Implementado en `game-events.ts`. 5 tests en `game-events.test.ts`.

## ~~DEV-02: Crear endpoint SSE para streaming de estado~~ ✅

- `GET /api/games/{code}/stream` retorna `text/event-stream`
- Envia estado inicial, luego actualizaciones via subscribe
- Heartbeat cada 30s, cleanup al cerrar

> Implementado en `stream.ts`.

## ~~DEV-03: Actualizar cliente para usar SSE en vez de reload~~ ✅

- Cliente SSE en `[code].astro` se conecta al stream
- Cuando recibe un estado diferente al ultimo, hace `window.location.reload()`
- Auto-reconexion con backoff exponencial

> Implementado en script de `[code].astro`.

## ~~DEV-04: Actualizar sala de espera para usar SSE~~ ✅

- WaitingRoom ahora tiene `id="waiting-room"` y `data-code`
- El script SSE detecta el waiting room y se conecta al stream
- Cuando `status` cambia a `playing`, recarga automaticamente

> WaitingRoom.astro actualizado.

## ~~DEV-05: Indicador de conexion~~ ✅

- Punto verde/rojo en GameInfo segun estado SSE
- Texto "Reconectando..." cuando desconectado
- CSS para estados connected/disconnected/connecting

> Implementado en `GameInfo.astro` con `#conn-indicator`.
