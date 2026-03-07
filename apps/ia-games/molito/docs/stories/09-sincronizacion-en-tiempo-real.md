# Story 09: Sincronizacion en tiempo real

## Descripcion

Los dos jugadores juegan desde dispositivos distintos. Cada accion que realiza un jugador (colocar, mover, eliminar) debe verse reflejada inmediatamente en la pantalla del rival sin necesidad de refrescar la pagina.

## Requisitos

### Comunicacion bidireccional

- Cada jugador mantiene una conexion persistente con el servidor (WebSocket o similar)
- Cuando un jugador realiza una accion validada, el servidor notifica al otro jugador inmediatamente
- El estado del tablero, turno, fase y contadores se sincronizan entre ambos clientes

### Eventos sincronizados

- Jugador 2 se une a la partida → Jugador 1 transiciona de sala de espera a tablero
- Jugador coloca ficha → el rival ve la ficha aparecer en la posicion
- Jugador mueve ficha → el rival ve el movimiento
- Jugador elimina ficha → el rival ve la ficha desaparecer
- Se forma molino → ambos ven el resaltado
- Fin de partida → ambos ven la pantalla de resultado

### Indicador de conexion

- Mostrar un indicador sutil de que la conexion esta activa
- Si se pierde la conexion, mostrar un aviso "Reconectando..." (ver Story 10)

### Consistencia

- El servidor es la fuente de verdad del estado del juego
- El cliente no debe permitir acciones optimistas que no hayan sido validadas por el servidor
- Si hay desincronizacion, el cliente debe recuperar el estado correcto del servidor

## Flujo del usuario

1. Jugador 1 coloca una ficha
2. La accion se envia al servidor
3. El servidor la valida y actualiza el estado
4. El servidor notifica a ambos jugadores
5. Jugador 2 ve la ficha colocada y que es su turno

## Fuera de alcance

- Chat entre jugadores
- Notificaciones push
- Modo offline
