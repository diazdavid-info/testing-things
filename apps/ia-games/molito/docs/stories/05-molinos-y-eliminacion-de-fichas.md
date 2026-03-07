# Story 05: Molinos y eliminacion de fichas

## Descripcion

Cuando un jugador forma un molino (tres fichas propias alineadas en una linea valida del tablero), obtiene el derecho de eliminar una ficha del rival. Esta mecanica es transversal a todas las fases del juego (colocacion, movimiento y vuelo).

## Requisitos

### Deteccion de molinos

- Tras cada colocacion o movimiento de ficha, el sistema comprueba si la posicion implicada forma parte de un molino
- Un molino son 3 posiciones alineadas (segun las lineas del tablero) ocupadas por el mismo jugador
- Si se detecta un molino nuevo, el turno cambia al estado `REMOVE` antes de pasar al siguiente jugador

### Feedback visual del molino

- Cuando se forma un molino, las 3 fichas que lo componen se resaltan visualmente de forma breve
- Se muestra un mensaje claro: "Has formado un molino. Elimina una ficha rival"
- Las fichas del rival que son eliminables se resaltan o se distinguen de las que no lo son

### Eliminacion de ficha rival

- El jugador selecciona (tap/click) una ficha del rival para eliminarla
- La ficha se retira del tablero y se actualiza el contador de fichas en tablero del rival

### Reglas de eliminacion

- No se puede eliminar una ficha que forme parte de un molino activo del rival
- Excepcion: si **todas** las fichas del rival estan en molinos, se puede eliminar cualquiera
- No se puede seleccionar una posicion vacia
- No se puede seleccionar una ficha propia
- Si se intenta una eliminacion invalida, mostrar mensaje de error y permitir reintentar

### Tras la eliminacion

- Una vez eliminada la ficha, el turno pasa al siguiente jugador
- Si tras eliminar, el rival queda con menos de 3 fichas (y ya no le quedan por colocar), la partida termina (ver Story 08)

## Flujo del usuario

1. El jugador coloca o mueve una ficha
2. Se forma un molino → las 3 fichas se resaltan
3. Se indica al jugador que debe eliminar una ficha rival
4. Las fichas eliminables del rival se distinguen visualmente
5. El jugador selecciona una ficha rival valida
6. La ficha se elimina del tablero
7. El turno pasa al siguiente jugador

## Fuera de alcance

- Animacion de eliminacion
- Historial de molinos formados
- Notificacion sonora
