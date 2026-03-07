# Story 03: Unirse a partida

## Descripcion

Un segundo jugador se une a una partida existente usando el link directo o introduciendo el codigo en la pantalla de inicio. Una vez unido, la partida comienza automaticamente para ambos jugadores.

## Requisitos

### Unirse por link

- Si el jugador abre el link de una partida en estado `waiting`, se une automaticamente como jugador 2
- El estado de la partida cambia a `playing`
- Se redirige directamente al tablero de juego

### Unirse por codigo

- El jugador introduce el codigo en la pantalla de inicio y pulsa "Unirse"
- Si el codigo es valido y la partida esta en `waiting`, se une como jugador 2
- Se redirige al tablero de juego

### Validaciones

- Si el codigo no existe → mostrar "Codigo no encontrado"
- Si la partida ya tiene 2 jugadores → mostrar "Partida llena"
- Si la partida esta en estado `finished` → mostrar "Esta partida ya ha terminado"
- Solo pueden participar 2 jugadores por partida

### Notificacion al jugador 1

- Cuando el jugador 2 se une, el jugador 1 (en la sala de espera) transiciona automaticamente al tablero

## Flujo del usuario

1. Jugador 2 recibe un link o codigo de su amigo
2. Opcion A: Abre el link → se une directamente
3. Opcion B: Abre la web, introduce el codigo, pulsa "Unirse"
4. Si todo es correcto, ambos jugadores ven el tablero y comienza la partida
5. El jugador 1 tiene el primer turno

## Fuera de alcance

- Elegir quien empieza
- Modo espectador
