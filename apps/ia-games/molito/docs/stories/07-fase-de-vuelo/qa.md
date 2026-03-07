# Story 07 — Tareas de QA

## QA-01: Tests unitarios de vuelo

- Test: jugador con 3 fichas puede mover a posicion no adyacente
- Test: jugador con 4 fichas NO puede mover a posicion no adyacente en misma partida
- Test: transicion a fly phase despues de eliminacion que deja rival con 3 fichas
- Test: `isPlayerBlocked` retorna false para jugador con 3 fichas (puede volar)
- Test: molino formado durante vuelo activa eliminacion

## QA-02: Tests de API

- Test: movimiento de vuelo exitoso via API (from no adyacente a to)
- Test: movimiento de vuelo rechazado para jugador con 4+ fichas

## QA-03: Tests de integracion visual

- Verificar que al seleccionar ficha en vuelo se resaltan todas las posiciones vacias
- Verificar badge "Vuelo" junto al jugador con 3 fichas
- Verificar que el jugador con 4+ fichas solo ve destinos adyacentes
