# Story 03 — Tareas de marketing y SEO

## ~~SEO-01: Metadatos dinamicos segun estado de partida~~ ✅

- Si la partida esta en `waiting`, mantener OG tags de invitacion (ya implementados en Story 02)
- Si la partida esta en `playing`, cambiar metadatos:
  - `og:title`: "Partida en curso — El Molino"
  - `og:description`: "Esta partida ya esta en curso. Crea tu propia partida para jugar."
- Si la partida no existe, mantener metadatos de error actuales
- Esto evita que links compartidos de partidas activas generen expectativas incorrectas

> Implementado en `[code].astro`. OG tags condicionales para `waiting` y `playing`. Description dinamica en el `<head>`.

## ~~MKT-01: Copywriting de estados de union~~ ✅

- Auto-join en progreso: "Uniendose a la partida..."
- Join exitoso: "Conectado!"
- Error partida llena: "Partida llena — Esta partida ya tiene dos jugadores"
- Error partida terminada: "Partida terminada — Esta partida ya ha finalizado"
- Subtexto en errores: "Puedes crear tu propia partida desde el inicio"

> Todo el copy implementado en `[code].astro` en las pantallas condicionales.

## ~~MKT-02: Eventos de analytics~~ ✅

- Nuevos eventos a documentar:
  - `auto_join_attempt` — el jugador 2 abre el link directo y se intenta auto-join
  - `auto_join_success` — auto-join exitoso
  - `auto_join_error` — auto-join fallo (con `error_type`: `full`, `finished`, `network`)
  - `join_via_form` — union exitosa via formulario (ya parcialmente cubierto por `click_join_game`)

> Eventos definidos en `lib/analytics-events.ts` como tipos TypeScript con stub `trackEvent()`.
