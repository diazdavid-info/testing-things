# Story 15 — Tareas de QA

## QA-01: Verificar que todos los tests existentes pasan

- Ejecutar `vitest run` — todos los tests deben pasar sin modificaciones
- Si algun test falla, es una regresion introducida por las correcciones responsive

## QA-02: Test de overflow horizontal en viewports mobile

- Verificar en 375px, 390px y 414px que no hay scroll horizontal en ninguna pantalla
- Pantallas a verificar: inicio, sala de espera, auto-join, tablero (colocacion, movimiento, vuelo), fin de partida, partida no encontrada, partida llena
- Comprobar tanto en orientacion vertical como horizontal

## QA-03: Test de interaccion tactil

- Verificar que todos los botones y puntos de interseccion del tablero son tocables en mobile
- Comprobar que no hay elementos superpuestos que bloqueen la interaccion
- Verificar que las areas tactiles cumplen el minimo de 44x44px

## QA-04: Test de consistencia visual Pencil vs UI

- Comparar lado a lado las pantallas principales en Pencil con la UI implementada
- Documentar cualquier discrepancia en colores, espaciados, tipografia o layout
- Verificar que los componentes del Design System se aplican de forma consistente en todas las pantallas

## QA-05: Test cross-browser mobile

- Verificar en Safari iOS y Chrome Android (minimo)
- Comprobar que no hay diferencias de rendering entre navegadores
- Prestar atencion especial al viewport handling (100vh, safe-area-inset, etc.)
