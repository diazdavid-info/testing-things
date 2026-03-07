# Story 04: Tablero y fase de colocacion

## Descripcion

Una vez que ambos jugadores estan conectados, se muestra el tablero clasico del molino con sus 24 posiciones. La partida comienza en la fase de colocacion: los jugadores colocan fichas alternadamente en posiciones vacias del tablero hasta agotar sus 9 fichas cada uno.

## Requisitos

### Tablero

- Dibujar el tablero clasico del molino: 3 cuadrados concentricos conectados por lineas en los puntos medios
- El tablero tiene 24 posiciones interactivas (clicables / tapables)
- Las posiciones vacias se muestran como puntos o circulos vacios
- Las fichas de cada jugador se muestran con colores claramente distintos
- El tablero es responsive y se adapta al tamano de pantalla

### Informacion del estado

- Mostrar de quien es el turno actual con un indicador visual claro
- Mostrar la fase actual: "Colocacion"
- Mostrar el numero de fichas pendientes de colocar de cada jugador (empieza en 9)
- Mostrar el numero de fichas en el tablero de cada jugador

### Colocacion de fichas

- Solo el jugador con el turno activo puede colocar una ficha
- Se coloca haciendo tap/click en una posicion vacia del tablero
- No se puede colocar en una posicion ocupada
- Tras colocar, se actualiza el contador de fichas pendientes y fichas en tablero
- El turno pasa al siguiente jugador (excepto si se forma un molino, ver Story 05)
- Cuando ambos jugadores han colocado sus 9 fichas, se transiciona automaticamente a la fase de movimiento (ver Story 06)

### Feedback visual

- Al pasar el raton por una posicion valida, resaltarla
- Si se intenta colocar en una posicion invalida (ocupada, fuera de turno), mostrar mensaje breve de error

## Flujo del usuario

1. Ambos jugadores ven el tablero vacio
2. Jugador 1 coloca una ficha en una posicion vacia
3. El turno pasa al jugador 2
4. Se repite alternadamente hasta que ambos han colocado sus 9 fichas
5. Se transiciona a la fase de movimiento

## Fuera de alcance

- Animaciones de colocacion
- Deshacer movimiento
- Sugerencias de donde colocar
