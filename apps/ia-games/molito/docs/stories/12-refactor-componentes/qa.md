# Story 12 — Tareas de QA

## QA-01: Verificar que todos los tests pasan sin cambios ✅

- Ejecutar `vitest run` — los 162 tests deben pasar sin modificar ningun test
- Si algun test falla, es un bug del refactor que debe corregirse

## QA-02: Verificar que los endpoints refactorizados mantienen comportamiento ✅

- Los tests de API existentes (api-games, api-place, api-move, api-remove, claim-victory, rematch) cubren la funcionalidad
- Verificar que no hay regresiones en los codigos de error (400, 403, 404, 409, 410)

## QA-03: Revision visual manual ✅

- Comparar capturas de pantalla antes/despues del refactor para verificar que no hay cambios visuales
- Verificar todas las rutas: home, waiting, auto-join, playing, finished, game-not-found, game-full
