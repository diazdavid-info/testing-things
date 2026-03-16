# Story 02 — Tareas de UI/UX (Pencil)

## UX-01: Disenar tablero de juego — Layout general desktop

- Disenar en Pencil la composicion completa de la pantalla de juego
- Disposicion:
  - Area del Jugador 2 (rival) en la parte superior
  - Area del Jugador 1 (jugador activo) en la parte inferior
  - Zona central con indicador de turno
- Cada area de jugador muestra:
  - Nombre o etiqueta del jugador ("Jugador 1", "Jugador 2")
  - Dos manos: izquierda y derecha
  - Cada mano con su valor numerico grande y visible (1-4)
- Zona de acciones del jugador activo:
  - Boton "Repartir"
  - Boton "Reiniciar" (discreto, accesible pero no protagonista)
- Las manos del rival se ven invertidas (perspectiva enfrentada)
- El area del jugador con el turno se destaca visualmente

> Pantalla: "Game - Desktop" en fichero `.pen`

## UX-02: Disenar tablero de juego — Variante movil

- Adaptar el layout del tablero a pantallas pequenas (320px - 480px) en Pencil
- Las areas de jugador se apilan verticalmente: rival arriba, jugador abajo
- Las manos deben ser lo suficientemente grandes para interactuar con el dedo
- Los numeros de dedos deben ser legibles sin esfuerzo
- Boton "Repartir" accesible y bien posicionado
- Boton "Reiniciar" accesible pero no molesta durante el juego
- Target tactil minimo de 44x44px en manos y botones

> Pantalla: "Game - Mobile" en fichero `.pen`

## UX-03: Disenar representacion visual de mano viva

- Disenar en Pencil como se ve una mano activa con dedos
- Opciones a explorar:
  - Icono de mano abierta con dedos levantados
  - Circulo o tarjeta con el numero grande
  - Combinacion: icono + numero
- El numero de dedos (1-4) debe ser el elemento mas visible y grande
- La mano debe verse claramente interactiva (se puede tocar/clicar)
- Disenar los 4 estados posibles: 1 dedo, 2 dedos, 3 dedos, 4 dedos

> Pantalla: "Game - Hand States" en fichero `.pen`

## UX-04: Disenar indicador de turno

- Disenar como se indica de quien es el turno actual
- El area del jugador activo se destaca (color de fondo, borde, brillo)
- Texto "Tu turno" o similar junto al jugador activo
- El jugador que espera se muestra con menor enfasis (opacidad reducida, colores apagados)
- La transicion entre turnos debe ser clara visualmente

> Incluido en pantallas "Game - Desktop" y "Game - Mobile"

## UX-05: Disenar estado inicial de partida

- Disenar en Pencil como se ve el tablero al comenzar una partida nueva
- Ambos jugadores con [1, 1]
- Jugador 1 tiene el turno (su area destaca)
- Todas las manos estan vivas y activas
- El jugador entiende de un vistazo: que tiene, que tiene el rival, y de quien es el turno
