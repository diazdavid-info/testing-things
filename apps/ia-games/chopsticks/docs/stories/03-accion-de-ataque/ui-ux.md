# Story 03 — Tareas de UI/UX (Pencil)

## UX-01: Disenar flujo de seleccion de mano atacante

- Disenar en Pencil el estado visual cuando el jugador toca una de sus manos para seleccionarla
- La mano seleccionada se destaca: borde resaltado, brillo, escala ligeramente mayor, o color de seleccion
- Las demas manos propias se mantienen interactivas (para cambiar seleccion)
- Disenar tambien el estado al deseleccionar (tocar la misma mano seleccionada)

> Pantalla: "Game - Attack: Source Selected" en fichero `.pen`

## UX-02: Disenar flujo de seleccion de mano objetivo

- Disenar en Pencil el estado visual cuando el jugador ha seleccionado su mano y debe elegir la mano rival
- Las manos rivales vivas se resaltan como objetivos validos (borde pulsante, color de targeting, o indicador visual)
- Las manos rivales muertas (0) se ven opacas y no interactivas
- Debe quedar claro que el siguiente paso es "toca una mano del rival"

> Pantalla: "Game - Attack: Targeting" en fichero `.pen`

## UX-03: Disenar resultado del ataque

- Disenar en Pencil como se muestra el resultado tras ejecutar el ataque
- La mano objetivo actualiza su valor con una transicion visual breve
- Si la mano llega a 5+, se muestra la transicion a estado eliminado (ver Story 04 UX)
- Opcional: mostrar brevemente la operacion (+2, +3, etc.) sobre la mano objetivo
- El cambio de turno se refleja inmediatamente tras el resultado

> Pantalla: "Game - Attack: Result" en fichero `.pen`

## UX-04: Disenar indicacion contextual durante el ataque

- Disenar un texto o indicador breve que guie al jugador:
  - Paso 1: "Selecciona una de tus manos" (o icono)
  - Paso 2: "Ahora toca una mano del rival" (o icono)
- El texto desaparece tras ejecutar la accion
- Debe ser sutil y no intrusivo, pero util para nuevos jugadores
