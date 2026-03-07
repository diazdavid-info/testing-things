# Story 06: Fase de movimiento

## Descripcion

Cuando ambos jugadores han colocado sus 9 fichas, la partida pasa a la fase de movimiento. En esta fase, cada jugador mueve una de sus fichas por turno a una posicion adyacente conectada que este vacia.

## Requisitos

### Transicion a fase de movimiento

- Cuando ambos jugadores tienen `piecesToPlace` a 0, la fase cambia automaticamente a "Movimiento"
- Se actualiza el indicador de fase en la interfaz

### Movimiento de fichas

- El jugador selecciona una ficha propia haciendo tap/click
- La ficha seleccionada se resalta visualmente
- Se resaltan las posiciones adyacentes validas (conectadas y vacias) como destinos posibles
- El jugador hace tap/click en una posicion destino valida para completar el movimiento
- Si el jugador hace tap/click en otra ficha propia, cambia la seleccion
- Si el jugador hace tap/click en una posicion invalida, se muestra mensaje de error breve

### Validaciones

- Solo se pueden mover fichas propias
- Solo se puede mover a posiciones adyacentes conectadas por una linea del tablero
- La posicion destino debe estar vacia
- Solo puede mover el jugador con el turno activo

### Tras el movimiento

- Si el movimiento forma un molino, se activa la fase de eliminacion (ver Story 05)
- Si no forma molino, el turno pasa al siguiente jugador
- Si el siguiente jugador no tiene movimientos validos (todas sus fichas estan bloqueadas), la partida termina (ver Story 08)

### Feedback visual

- Ficha seleccionada resaltada
- Posiciones destino validas resaltadas
- Posiciones invalidas no resaltadas
- Opcion de deseleccionar haciendo tap/click en la misma ficha o en un area vacia no valida

## Flujo del usuario

1. Es el turno del jugador y la fase es "Movimiento"
2. Selecciona una de sus fichas
3. Ve las posiciones adyacentes disponibles resaltadas
4. Selecciona una posicion destino
5. La ficha se mueve a la nueva posicion
6. Si forma molino → elimina ficha rival
7. El turno pasa al siguiente jugador

## Fuera de alcance

- Animacion de movimiento
- Deshacer movimiento
- Sugerencias de movimiento
