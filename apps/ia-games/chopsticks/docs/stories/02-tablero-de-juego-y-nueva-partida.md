# Story 02: Tablero de juego y nueva partida

## Descripcion

Al iniciar una partida, se muestra el tablero con las cuatro manos (dos por jugador) en su estado inicial. El jugador debe entender de un vistazo el estado de cada mano, de quien es el turno y que acciones puede realizar. La partida es local: dos jugadores en el mismo dispositivo.

## Requisitos

### Disposicion del tablero

- Area del rival (Jugador 2) en la parte superior de la pantalla
- Area del jugador activo (Jugador 1) en la parte inferior
- Cada jugador muestra dos manos: izquierda y derecha
- Cada mano muestra claramente el numero de dedos activos (1-4) con un numero visible
- Las manos del rival se ven invertidas respecto a las del jugador (perspectiva enfrentada)

### Estado inicial

- Al empezar, ambos jugadores tienen sus manos en [1, 1]
- Todas las manos estan vivas y activas
- El Jugador 1 tiene el primer turno

### Indicador de turno

- Debe mostrarse claramente de quien es el turno actual
- El area del jugador activo debe destacarse visualmente respecto al jugador que espera

### Acciones disponibles

- El jugador activo puede ver dos opciones: atacar (seleccionando una mano propia) o pulsar el boton "Repartir"
- El boton "Repartir" solo esta habilitado si existen repartos validos para ese jugador
- Boton "Reiniciar" accesible en todo momento (ver Story 06)

### Responsive

- El tablero se adapta a movil (vertical) y escritorio
- En movil, los jugadores se turnan en el mismo dispositivo: el jugador activo siempre interactua desde la parte inferior

## Flujo del usuario

1. El jugador pulsa "Nueva partida" en la pantalla de inicio
2. Se muestra el tablero con ambos jugadores en estado [1, 1]
3. Se indica que el Jugador 1 tiene el turno
4. El Jugador 1 elige atacar (ver Story 03) o repartir (ver Story 05)

## Fuera de alcance

- Seleccion de nombres de jugadores
- Eleccion de colores o temas visuales
- Animacion de entrada al tablero
- Modo online o multijugador remoto
