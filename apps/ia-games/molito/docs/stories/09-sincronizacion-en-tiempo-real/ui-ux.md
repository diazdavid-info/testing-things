# Story 09 — Tareas de UI/UX (Pencil)

## ~~UX-01: Disenar indicador de conexion~~ ✅

- Punto verde "Conectado" y punto rojo "Reconectando..." en panel info
- Dos estados visualizados en frame Pencil

> Frame `GbWpS` "S09 — Connection Indicator Desktop" con ambos estados.

## ~~UX-02: Disenar animacion de actualizacion del tablero~~ ✅

- Actualizacion via page reload (server-rendered) — transicion instantanea al nuevo estado
- Board positions ya tienen `transition-all duration-150` para cambios suaves

> Existente en Board.astro CSS.
