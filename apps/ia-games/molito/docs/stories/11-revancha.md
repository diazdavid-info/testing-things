# Story 11: Revancha

## Descripcion

Al finalizar una partida, los jugadores pueden jugar una revancha sin tener que crear una partida nueva ni compartir un codigo de nuevo. Ambos deben aceptar para que la revancha comience.

## Requisitos

### Proponer revancha

- En la pantalla de fin de partida, ambos jugadores ven un boton "Revancha"
- Al pulsar, el rival ve un mensaje: "Tu rival quiere la revancha"
- El jugador que propuso ve: "Esperando respuesta del rival..."

### Aceptar revancha

- Si el segundo jugador tambien pulsa "Revancha", se inicia una nueva partida
- Se reutilizan los mismos jugadores (no hace falta nuevo codigo ni link)
- El tablero se reinicia: 24 posiciones vacias, ambos jugadores con 9 fichas por colocar
- El jugador que perdio la partida anterior tiene el primer turno

### Rechazar revancha

- Si un jugador pulsa "Volver al inicio" en vez de "Revancha", el otro ve: "Tu rival ha abandonado la sala"
- El jugador que se quedo puede volver al inicio tambien

### Timeout

- Si nadie pulsa "Revancha" en un tiempo razonable, ambos pueden volver al inicio
- Si un jugador se desconecta en la pantalla de resultado, el otro ve aviso y puede volver al inicio

## Flujo del usuario

1. La partida termina
2. Jugador A pulsa "Revancha"
3. Jugador B ve la propuesta y pulsa "Revancha"
4. Se inicia nueva partida con el tablero limpio
5. El perdedor de la partida anterior empieza

## Fuera de alcance

- Contador de victorias entre los mismos jugadores
- Revancha automatica (sin aceptacion)
- Cambiar de color de fichas en la revancha
