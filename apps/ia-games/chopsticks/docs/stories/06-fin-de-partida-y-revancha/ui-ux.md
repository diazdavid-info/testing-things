# Story 06 — Tareas de UI/UX (Pencil)

## UX-01: Disenar pantalla de victoria — Overlay

- Disenar en Pencil el overlay que aparece al finalizar la partida
- El tablero final se mantiene visible de fondo (con opacidad reducida o blur)
- Elementos del overlay:
  - Mensaje de victoria grande y claro: "Gana Jugador 1" o "Gana Jugador 2"
  - Icono o ilustracion de celebracion (trofeo, manos alzadas, confeti sutil)
  - Boton primario "Revancha"
  - Boton secundario "Volver al inicio"
- Lenguaje sencillo y amigable para ninos
- El overlay debe ser central y no desplazar el tablero

> Pantalla: "Game - Victory Overlay" en fichero `.pen`

## UX-02: Disenar variante movil de la pantalla de victoria

- Adaptar el overlay de victoria a pantallas pequenas en Pencil
- Los botones ocupan el ancho completo
- El mensaje de victoria sigue siendo grande y legible
- Los botones son tactiles (>= 44x44px)

> Pantalla: "Game - Victory Overlay Mobile" en fichero `.pen`

## UX-03: Disenar boton de reinicio durante la partida

- Disenar en Pencil la posicion y estilo del boton "Reiniciar" durante el juego
- Debe ser accesible pero discreto: no debe interferir con el flujo de juego
- Posicion sugerida: esquina superior o zona de utilidades
- Estilo: boton terciario o icono con texto

> Incluido en pantallas "Game - Desktop" y "Game - Mobile"

## UX-04: Disenar transicion de final de partida

- Disenar en Pencil los frames clave de la transicion cuando la partida termina
- Secuencia sugerida:
  1. La ultima mano se elimina (transicion de Story 04)
  2. Breve pausa (medio segundo)
  3. El overlay de victoria aparece con animacion suave (fade in + scale)
- La transicion no debe ser abrupta ni demasiado lenta
