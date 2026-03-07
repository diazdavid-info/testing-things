# Story 03 — Tareas de UI/UX (Pencil)

> Nota: Muchas pantallas ya estan disenadas en Story 02 (sala de espera, feedback copiado, partida no encontrada, jugador conectado). Aqui se disenan las pantallas especificas del flujo de union.

## UX-01: Disenar pantalla de auto-join por link — Desktop y Mobile

- El jugador 2 abre el link y ve brevemente un estado de "Uniendose a la partida..."
- Elementos:
  - Spinner o indicador de carga centrado
  - Texto "Uniendose a la partida..." debajo
  - Fondo consistente con el resto de la app
- Este estado es transitorio (1-2 segundos max) antes de mostrar el tablero

## UX-02: Disenar estado de error en union por link

- Si el auto-join falla (partida llena, terminada, etc.), mostrar pantalla de error
- Reutilizar el diseno de "Partida no encontrada" (Story 02 UX-04) con mensajes adaptados:
  - "Partida llena" — "Esta partida ya tiene dos jugadores"
  - "Partida terminada" — "Esta partida ya ha finalizado"
- Boton "Volver al inicio" en ambos casos
- Variantes desktop y mobile

## UX-03: Disenar transicion de join exitoso a tablero

- Cuando el join es exitoso (tanto por link como por formulario), breve confirmacion visual
- Texto "Partida encontrada!" o "Conectado!" con check verde
- Transicion rapida (fade ~500ms) al tablero placeholder
- Debe sentirse fluido, sin saltos bruscos
