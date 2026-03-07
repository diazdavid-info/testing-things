# Story 07: Fase de vuelo

## Descripcion

Cuando un jugador se queda con exactamente 3 fichas en el tablero (y no le quedan fichas por colocar), entra en la fase de vuelo. En esta fase puede mover cualquiera de sus fichas a cualquier posicion vacia del tablero, sin restriccion de adyacencia.

## Requisitos

### Activacion del vuelo

- Un jugador entra en vuelo cuando tiene exactamente 3 fichas en tablero y 0 por colocar
- La fase de vuelo es individual: un jugador puede estar en vuelo mientras el otro sigue en movimiento normal
- Se actualiza el indicador de fase para ese jugador (ej: "Vuelo")

### Movimiento en vuelo

- El jugador selecciona una ficha propia
- Al seleccionar, **todas** las posiciones vacias del tablero se resaltan como destinos validos
- El jugador selecciona cualquier posicion vacia como destino
- No hay restriccion de adyacencia

### Reglas que se mantienen

- Solo se pueden mover fichas propias
- La posicion destino debe estar vacia
- Si el movimiento forma un molino, se activa eliminacion (ver Story 05)
- Tras el movimiento, el turno pasa al siguiente jugador

### Interaccion con el rival

- El rival que tiene mas de 3 fichas sigue moviendose solo a posiciones adyacentes
- Ambos jugadores deben ver claramente cuando el rival esta en fase de vuelo

## Flujo del usuario

1. El jugador tiene 3 fichas en el tablero
2. Se indica que esta en fase de vuelo
3. Selecciona una ficha propia
4. Ve todas las posiciones vacias como destinos validos
5. Selecciona una posicion vacia
6. La ficha se mueve
7. Si forma molino → elimina ficha rival
8. El turno pasa al rival

## Fuera de alcance

- Desactivar vuelo (las reglas clasicas siempre lo permiten con 3 fichas)
- Variantes sin fase de vuelo
