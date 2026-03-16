# Story 05: Accion de reparto

## Descripcion

El jugador activo puede elegir repartir sus dedos entre sus dos manos en lugar de atacar. El reparto permite redistribuir el total de dedos del jugador en una nueva combinacion valida. Esta accion es estrategica y puede usarse para revivir una mano eliminada.

## Requisitos

### Activacion del reparto

- El jugador activo pulsa el boton "Repartir" durante su turno
- El boton solo esta habilitado si existen al menos un reparto valido
- Si no hay repartos validos, el boton se muestra deshabilitado con un indicador visual claro (gris, opaco)

### Panel de opciones de reparto

- Al pulsar "Repartir", se abre un panel o modal con las distribuciones validas
- Cada opcion se muestra como un par de valores: [izquierda, derecha]
- Solo se muestran opciones validas (no se permite al jugador introducir valores manualmente)
- El jugador puede cancelar y volver al estado normal del turno sin consumir su accion

### Reglas de validacion

- La suma total de dedos antes y despues del reparto debe ser la misma
- Ambos valores deben estar entre 0 y 4
- El nuevo estado debe ser distinto al actual (no se permite repartir sin cambiar nada)
- Se permite que una mano quede en 0 si la otra absorbe todos los dedos
- Se permite revivir una mano eliminada (valor 0) asignandole dedos desde la otra mano

### Revivir mano eliminada

- Si un jugador tiene una mano en 0 y otra con valor suficiente, puede redistribuir para dar vida a la mano muerta
- Ejemplo: estado [4, 0] → reparto valido [2, 2] o [3, 1] o [1, 3]
- La mano revivida pasa a mostrarse como viva con su nuevo valor

### Casos donde no se puede repartir

- Si el total de dedos es 5 o mas (imposible porque el maximo vivo es [4, algo] y el total nunca supera 8... pero un total de 5 no tiene reparto valido porque una mano tendria que tener 5)
- Si el unico reparto posible resulta en el mismo estado actual
- Ejemplo: estado [4, 1], total = 5 → no hay reparto valido (5,0 y 0,5 no son validos porque >4)

### Resolucion del reparto

- El jugador selecciona una de las opciones validas
- Las manos del jugador se actualizan inmediatamente con los nuevos valores
- El turno pasa al otro jugador

## Flujo del usuario

1. Es el turno del jugador activo
2. Pulsa el boton "Repartir"
3. Ve las distribuciones validas disponibles
4. Selecciona una distribucion
5. Sus manos se actualizan con los nuevos valores
6. El turno pasa al otro jugador

### Ejemplo 1: reparto basico

- Estado actual: [3, 1]
- Opciones validas: [2, 2], [1, 3], [4, 0], [0, 4]
- El jugador elige [2, 2]
- Sus manos pasan a [2, 2]

### Ejemplo 2: revivir mano

- Estado actual: [4, 0]
- Opciones validas: [2, 2], [3, 1], [1, 3], [0, 4]
- El jugador elige [2, 2]
- Su mano muerta revive con valor 2

### Ejemplo 3: sin reparto posible

- Estado actual: [4, 1], total = 5
- No existe ninguna combinacion valida distinta con ambos valores entre 0 y 4
- El boton "Repartir" esta deshabilitado

## Fuera de alcance

- Input manual de valores
- Reparto con modulo 5
- Animacion elaborada del reparto
- Confirmacion antes de ejecutar (el jugador selecciona una opcion y se ejecuta directamente)
