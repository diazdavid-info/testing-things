# Story 04 — Tareas de desarrollo

## DEV-01: Logica de eliminacion en el motor de juego

- Verificar que `applyAttack` (Story 03 DEV-01) pone correctamente la mano a 0 cuando el resultado es >= 5
- Implementar funcion `isHandAlive(handValue)` que devuelve `true` si el valor es > 0
- Implementar funcion `getAliveHands(player)` que devuelve las manos vivas de un jugador
- Implementar funcion `isPlayerEliminated(player)` que devuelve `true` si ambas manos estan a 0

**Tests:**
- `isHandAlive(0)` devuelve `false`
- `isHandAlive(1)` devuelve `true`
- `isHandAlive(4)` devuelve `true`
- `getAliveHands` con [3, 0] devuelve solo la mano izquierda
- `getAliveHands` con [0, 0] devuelve lista vacia
- `getAliveHands` con [2, 4] devuelve ambas manos
- `isPlayerEliminated` con [0, 0] devuelve `true`
- `isPlayerEliminated` con [1, 0] devuelve `false`

## DEV-02: Estado visual de mano eliminada en UI

- Actualizar el componente de mano para mostrar estado eliminado cuando valor = 0
- Aplicar estilos de mano muerta segun diseno de Pencil (UX-01):
  - Opacidad reducida
  - Color desaturado
  - Icono de mano cerrada o visual equivalente
- Mostrar "0" como valor pero con menor enfasis visual
- Remover interactividad: sin cursor pointer, sin hover, sin eventos de click

**Tests:**
- Mano con valor 0 aplica clase o estilo de eliminada
- Mano con valor 0 no dispara eventos al hacer click
- Mano con valor > 0 no muestra estilos de eliminada
- El cambio de valor > 0 a 0 aplica correctamente los estilos

## DEV-03: Restricciones de interaccion con manos muertas

- Mano muerta propia no se puede seleccionar como atacante
- Mano muerta rival no se puede seleccionar como objetivo de ataque
- En el flujo de ataque, las manos muertas no se resaltan como interactivas
- En el flujo de reparto (Story 05), las manos muertas participan en el calculo de total pero no como destino independiente

**Tests:**
- Click en mano muerta propia no la selecciona
- Click en mano muerta rival no ejecuta ataque
- `getValidAttackTargets` no incluye manos muertas
- Con una mano muerta, la unica mano viva es la unica seleccionable

## DEV-04: Comportamiento con una sola mano viva

- Si el jugador tiene una sola mano viva, esa es la unica que puede seleccionar como atacante
- El rival solo puede atacar la mano viva del jugador
- El flujo de ataque funciona normalmente con una sola mano

**Tests:**
- Jugador con [3, 0] solo puede seleccionar la mano izquierda
- Rival atacando a jugador con [0, 2] solo puede apuntar a la mano derecha
- Ataque funciona correctamente con una sola mano viva por jugador
