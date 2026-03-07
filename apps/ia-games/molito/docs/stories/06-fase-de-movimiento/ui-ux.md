# Story 06 — Tareas de UI/UX (Pencil)

## ~~UX-01: Disenar estado de seleccion de ficha — Desktop~~ ✅

- En fase de movimiento, cuando el jugador hace click en una ficha propia:
  - La ficha seleccionada se resalta: borde mas grueso, color de acento, escala ligeramente mayor
  - Las posiciones adyacentes vacias se resaltan como destinos validos: circulo con borde punteado o color diferente, cursor pointer
  - Las fichas propias no seleccionadas siguen siendo clicables (para cambiar seleccion)
  - Las fichas del rival y posiciones no adyacentes: aspecto normal, no clicables
- El indicador de turno muestra "Tu turno — Selecciona una ficha"
- Tras seleccionar ficha, el indicador cambia a "Selecciona destino"

> Frame `oB6ud` "S06 — Move Selection Desktop" con pieza seleccionada (pos-7 con glow), destinos verdes (pos-6, pos-8), "Fase: Movimiento".

## ~~UX-02: Disenar estado de seleccion de ficha — Mobile~~ ✅

- Adaptar el diseno de seleccion a mobile
- La ficha seleccionada y destinos deben ser lo suficientemente grandes para tap
- Los destinos validos deben distinguirse claramente de las posiciones vacias normales

> Frame `zz080` "S06 — Move Selection Mobile" con "Tu turno — Selecciona ficha" y badge "Movimiento".

## ~~UX-03: Disenar estado "Turno del rival — Movimiento"~~ ✅

- Cuando es turno del rival en fase movimiento:
  - Mostrar "Turno del rival" con indicador de espera
  - El tablero no es interactivo
  - Las fichas del rival pueden tener un sutil indicador de que se estan "pensando" (opcional)

> Frame `rW3wN` "S06 — Rival Moving Desktop" con indicador gris "Turno del rival" y "Fase: Movimiento".
