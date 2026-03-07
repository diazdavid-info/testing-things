# Story 13 — Tareas de QA

## QA-01: Verificar que los tests siguen pasando

- `vitest run` — 162 tests deben pasar (el Dockerfile no afecta el codigo)

## QA-02: Validar contenedor Docker

- Build exitoso sin errores
- La app responde en http://localhost:4321
- Las rutas principales funcionan: /, /molino/{code}
- Los endpoints API responden correctamente
