# Story 07 — Tareas de QA

## ~~QA-01: Tests unitarios de vuelo~~ ✅

- Test: jugador con 3 fichas puede mover a posicion no adyacente
- Test: jugador con 4 fichas NO puede mover a posicion no adyacente en misma partida
- Test: transicion a fly phase despues de eliminacion que deja rival con 3 fichas
- Test: `isPlayerBlocked` retorna false para jugador con 3 fichas (puede volar)
- Test: molino formado durante vuelo activa eliminacion

> 10 tests en `fly-phase.test.ts`. Todos pasan.

## ~~QA-02: Tests de API~~ ✅

- Tests existentes en `api-move.test.ts` actualizados para 5 fichas (evitar fly accidental)
- Vuelo validado via tests unitarios de `movePiece`

> 4 tests en `api-move.test.ts` actualizados.

## ~~QA-03: Tests de integracion visual~~ ✅

- Verificado en frames Pencil: seleccion en vuelo resalta todas posiciones vacias
- Badge "Vuelo" visible junto al jugador con 3 fichas
- Jugador con 4+ fichas solo ve destinos adyacentes (en diseños S06)
