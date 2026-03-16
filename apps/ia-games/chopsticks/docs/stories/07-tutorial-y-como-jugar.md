# Story 07: Tutorial y como jugar

## Descripcion

El jugador puede acceder a una pantalla de ayuda que explica las reglas del juego de forma clara, breve y visual. El tutorial debe ser comprensible para ninos y adultos sin experiencia previa. Debe cubrir las dos acciones principales (atacar y repartir) con ejemplos concretos.

## Requisitos

### Acceso

- Desde la pantalla de inicio mediante el boton "Como jugar" (ver Story 01)
- Opcionalmente accesible desde el tablero de juego con un boton de ayuda (icono de interrogacion o similar)

### Contenido del tutorial

El tutorial debe explicar, en orden:

1. **Objetivo**: eliminar las dos manos del rival
2. **Estado inicial**: cada jugador empieza con [1, 1]
3. **Turnos**: los jugadores se alternan, una accion por turno
4. **Atacar**: selecciona una mano tuya y toca una mano del rival. Los dedos se suman. Si llega a 5 o mas, la mano muere
5. **Repartir**: redistribuye tus dedos entre tus dos manos. Puedes revivir una mano muerta
6. **Victoria**: gana quien elimine las dos manos del rival

### Formato

- Texto breve y directo, sin jerga
- Al menos un ejemplo visual de ataque: "Tu mano tiene 2, la rival tiene 3. Atacas: 3 + 2 = 5. La mano rival muere"
- Al menos un ejemplo visual de reparto: "Tienes [4, 0]. Repartes a [2, 2]. Tu mano muerta revive"
- Usar iconos o ilustraciones simples de manos con dedos si es posible
- El contenido debe caber en una pantalla sin scroll excesivo (maximo 2-3 pantallas de scroll en movil)

### Navegacion

- Boton para volver a la pantalla de inicio o cerrar el tutorial
- Si se accede desde el tablero, el tutorial se muestra como overlay y al cerrarlo se vuelve a la partida en curso

## Flujo del usuario

### Desde la pantalla de inicio

1. El jugador pulsa "Como jugar"
2. Ve la pantalla de tutorial con las reglas y ejemplos
3. Pulsa "Volver" para regresar a la pantalla de inicio

### Desde el tablero

1. El jugador pulsa el icono de ayuda durante una partida
2. Se muestra un overlay con las reglas resumidas
3. Cierra el overlay y continua jugando

## Fuera de alcance

- Tutorial interactivo paso a paso
- Video explicativo
- Tutorial obligatorio antes de la primera partida
- Traducciones a otros idiomas
