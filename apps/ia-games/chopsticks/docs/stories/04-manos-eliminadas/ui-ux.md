# Story 04 — Tareas de UI/UX (Pencil)

## UX-01: Disenar estado visual de mano eliminada

- Disenar en Pencil como se ve una mano con valor 0 (eliminada)
- La mano debe verse claramente distinta de una mano viva
- Usar multiples indicadores visuales (no depender solo del color):
  - Opacidad reducida
  - Icono de mano cerrada o puno
  - Tachado o cruce sutil
  - Color gris o desaturado
- El numero 0 debe ser visible pero discreto
- La mano no debe parecer interactiva (sin hover, sin cursor pointer)

> Pantalla: "Game - Dead Hand" en fichero `.pen`

## UX-02: Disenar transicion de mano viva a eliminada

- Disenar en Pencil los frames clave de la transicion cuando una mano muere
- La transicion debe ser rapida pero perceptible (no instantanea ni lenta)
- Sugerencia: la mano se "cierra" o se desvanece brevemente antes de mostrar el estado muerto
- El jugador debe entender que la mano acaba de ser eliminada

> Pantalla: "Game - Hand Death Transition" en fichero `.pen`

## UX-03: Disenar tablero con jugador que tiene una mano muerta

- Disenar en Pencil como se ve el tablero cuando un jugador tiene una mano viva y otra muerta
- La mano muerta se ve inactiva pero sigue ocupando su espacio visual (no desaparece)
- La mano viva restante se ve claramente activa e interactiva
- El jugador entiende que solo puede usar la mano viva
- Disenar para ambos casos: mano izquierda muerta y mano derecha muerta

> Pantalla: "Game - One Hand Dead" en fichero `.pen`

## UX-04: Disenar tablero con ambas manos de un jugador eliminadas

- Disenar en Pencil como se ve cuando un jugador tiene [0, 0]
- Ambas manos se ven eliminadas
- Este estado conecta con la pantalla de fin de partida (Story 06 UX)
- Debe ser visualmente impactante: el jugador ha perdido

> Pantalla: "Game - Both Hands Dead" en fichero `.pen`
