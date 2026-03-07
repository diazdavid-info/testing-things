# Story 08: Fin de partida

## Descripcion

La partida termina cuando un jugador cumple una condicion de derrota. Se muestra el resultado a ambos jugadores con la opcion de iniciar una nueva partida o volver al inicio.

## Requisitos

### Condiciones de derrota

Un jugador pierde si:

- Tiene menos de 3 fichas en el tablero (y ya no le quedan por colocar)
- No puede realizar ningun movimiento valido en su turno (todas sus fichas estan bloqueadas por fichas adyacentes)

### Deteccion automatica

- El sistema comprueba las condiciones de derrota tras cada eliminacion de ficha y al inicio de cada turno
- En cuanto se detecta una condicion de derrota, la partida pasa a estado `finished`
- Se registra el jugador ganador

### Pantalla de resultado

- Se muestra un overlay o pantalla con el resultado
- El ganador ve: "Has ganado!"
- El perdedor ve: "Has perdido"
- Se indica el motivo: "Tu rival se ha quedado sin fichas" o "Tu rival no puede mover"
- Boton "Nueva partida" que crea una partida nueva y lleva a la sala de espera
- Boton "Volver al inicio" que lleva a la pantalla principal

### Estado final del tablero

- El tablero se mantiene visible con el estado final de la partida como fondo de la pantalla de resultado
- No se permiten mas interacciones con el tablero

## Flujo del usuario

1. Se detecta condicion de derrota
2. El juego se detiene
3. Ambos jugadores ven la pantalla de resultado
4. Pueden elegir crear nueva partida o volver al inicio

## Fuera de alcance

- Estadisticas de la partida (duracion, numero de molinos, etc.)
- Compartir resultado en redes sociales
- Sistema de puntuacion
