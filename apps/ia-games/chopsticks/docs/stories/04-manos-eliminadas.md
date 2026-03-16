# Story 04: Manos eliminadas

## Descripcion

Cuando una mano alcanza 5 o mas dedos tras un ataque, queda eliminada y pasa a valor 0. Una mano eliminada no puede participar en el juego hasta que sea revivida mediante un reparto (ver Story 05). El jugador debe entender visualmente de forma inmediata que una mano esta muerta y que no puede interactuar con ella.

## Requisitos

### Eliminacion

- Una mano queda eliminada cuando su valor llega a 5 o mas como resultado de un ataque
- La mano eliminada pasa a mostrar valor 0
- La eliminacion es inmediata y se muestra con feedback visual claro

### Estado visual de mano eliminada

- La mano eliminada debe verse claramente distinta de una mano viva
- Usar mas de un indicador visual (no depender solo del color): opacidad reducida, icono de mano cerrada, tachado, o similar
- El numero 0 debe ser visible en la mano eliminada
- La mano eliminada no debe parecer interactiva

### Restricciones de mano eliminada

- Una mano eliminada no puede ser seleccionada como atacante
- Una mano eliminada no puede ser objetivo de un ataque
- Una mano eliminada no participa en el reparto como destino independiente, pero sus dedos (0) si cuentan en el total del jugador para el calculo de reparto
- Solo se puede revivir una mano eliminada mediante la accion de reparto (ver Story 05)

### Jugador con una sola mano viva

- Si un jugador tiene una mano eliminada y otra viva, sigue jugando normalmente con la mano que le queda
- La unica mano viva se selecciona automaticamente al atacar, o el jugador la toca para confirmar
- El rival solo puede atacar la mano viva restante

## Flujo del usuario

1. El rival ataca una mano del jugador
2. El resultado del ataque es 5 o mas
3. La mano pasa a 0 y se muestra visualmente como eliminada
4. El jugador entiende que esa mano ya no puede usarse ni ser atacada
5. El jugador sigue jugando con su mano restante o intenta revivir mediante reparto

## Fuera de alcance

- Animacion elaborada de eliminacion
- Sonido de eliminacion
- Mensajes emergentes al eliminar una mano
