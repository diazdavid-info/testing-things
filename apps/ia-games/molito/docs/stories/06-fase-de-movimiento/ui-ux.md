# Story 06 — Tareas de UI/UX (Pencil)

## UX-01: Disenar estado de seleccion de ficha — Desktop

- En fase de movimiento, cuando el jugador hace click en una ficha propia:
  - La ficha seleccionada se resalta: borde mas grueso, color de acento, escala ligeramente mayor
  - Las posiciones adyacentes vacias se resaltan como destinos validos: circulo con borde punteado o color diferente, cursor pointer
  - Las fichas propias no seleccionadas siguen siendo clicables (para cambiar seleccion)
  - Las fichas del rival y posiciones no adyacentes: aspecto normal, no clicables
- El indicador de turno muestra "Tu turno — Selecciona una ficha"
- Tras seleccionar ficha, el indicador cambia a "Selecciona destino"

## UX-02: Disenar estado de seleccion de ficha — Mobile

- Adaptar el diseno de seleccion a mobile
- La ficha seleccionada y destinos deben ser lo suficientemente grandes para tap
- Los destinos validos deben distinguirse claramente de las posiciones vacias normales

## UX-03: Disenar estado "Turno del rival — Movimiento"

- Cuando es turno del rival en fase movimiento:
  - Mostrar "Turno del rival" con indicador de espera
  - El tablero no es interactivo
  - Las fichas del rival pueden tener un sutil indicador de que se estan "pensando" (opcional)
