# Story 14 — Tareas de QA

## QA-01: Tests de validacion de input

- Test: posiciones negativas, decimales, NaN, Infinity son rechazadas
- Test: playerId vacio, null, undefined son rechazados
- Test: body malformado (no-JSON) retorna 400

## QA-02: Tests de seguridad de cookies

- Test: cookie tiene atributos HttpOnly y SameSite
- Test: manipular cookie no da acceso a partida ajena

## QA-03: Tests de headers de seguridad

- Test: respuestas incluyen X-Content-Type-Options, X-Frame-Options
- Verificar que no hay XSS posible en contenido dinamico

## QA-04: Verificar todos los tests existentes

- `vitest run` — 162+ tests deben pasar
