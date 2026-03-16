# Story 06: Fin de partida y revancha

## Descripcion

La partida termina cuando un jugador tiene ambas manos eliminadas [0, 0]. Se muestra el resultado de forma clara y se ofrece la posibilidad de jugar una revancha inmediata o volver a la pantalla de inicio. Tambien se puede reiniciar la partida en cualquier momento durante el juego.

## Requisitos

### Deteccion de victoria

- El sistema comprueba si alguno de los jugadores tiene ambas manos en [0, 0] tras cada ataque
- En cuanto se detecta, la partida termina inmediatamente
- No se permiten mas acciones sobre el tablero salvo reiniciar o revancha

### Pantalla de resultado

- Se muestra un overlay sobre el tablero con el resultado
- Mensaje claro: "Gana Jugador 1" o "Gana Jugador 2"
- El tablero final se mantiene visible de fondo para que los jugadores vean el estado final
- Lenguaje sencillo, adecuado para ninos

### Opciones post-partida

- Boton "Revancha": inicia una nueva partida inmediatamente con el mismo formato (2 jugadores, mismas reglas)
- Boton "Volver al inicio": lleva a la pantalla principal (ver Story 01)
- En la revancha, el jugador que perdio empieza primero

### Reinicio durante la partida

- En cualquier momento durante una partida activa, los jugadores pueden pulsar "Reiniciar"
- El reinicio devuelve al estado inicial: ambos jugadores con [1, 1], turno del Jugador 1
- No se pide confirmacion (partidas cortas, el coste de reiniciar es bajo)

## Flujo del usuario

### Victoria

1. Un ataque deja al rival con [0, 0]
2. La partida se detiene
3. Se muestra la pantalla de resultado con el ganador
4. El jugador elige "Revancha" o "Volver al inicio"

### Reinicio

1. Durante una partida activa, un jugador pulsa "Reiniciar"
2. El tablero vuelve al estado inicial [1, 1] para ambos
3. El Jugador 1 tiene el turno

## Fuera de alcance

- Estadisticas de la partida (duracion, numero de turnos, etc.)
- Historial de partidas
- Compartir resultado
- Confirmacion antes de reiniciar
- Empate (no existe en este juego)
