# Story 08 — Tareas de UI/UX (Pencil)

## UX-01: Disenar estados de interaccion de las manos

- Disenar en Pencil todos los estados visuales posibles de una mano:
  - **Normal**: mano viva en reposo, turno del jugador
  - **Hover/Focus**: resaltado sutil al pasar el raton o foco por teclado
  - **Seleccionada**: la mano ha sido tocada como atacante (borde destacado, escala)
  - **Objetivo valido**: mano rival resaltada como posible objetivo de ataque
  - **Eliminada**: mano con valor 0, opaca, no interactiva
  - **No interactiva**: mano viva pero no es turno del jugador (sin hover, opacidad ligeramente reducida)
- Crear una tabla o cuadricula en Pencil con todos los estados lado a lado para comparacion

> Pantalla: "Design - Hand Interaction States" en fichero `.pen`

## UX-02: Disenar transiciones de cambio de valor

- Disenar en Pencil los frames clave de las transiciones:
  - Valor de mano aumenta tras ataque (ej: 1 → 3): transicion numerica suave
  - Mano pasa a 0 tras eliminacion: transicion a estado muerto
  - Mano revive tras reparto (0 → 2): transicion de muerta a viva
  - Cambio de turno: transicion de enfasis entre areas de jugadores
- Las transiciones deben ser rapidas (200-400ms) pero perceptibles
- No deben bloquear la interaccion

> Pantalla: "Design - Transitions" en fichero `.pen`

## UX-03: Disenar indicadores de accion no disponible

- Disenar como se comunica visualmente que una accion no es posible:
  - Mano muerta: opaca, sin cursor pointer, sin hover
  - Boton "Repartir" deshabilitado: gris, opaco
  - Mano rival cuando no hay atacante seleccionado: no resaltada
  - Area del jugador no activo: opacidad reducida, no interactiva
- No se usan mensajes de error intrusivos: la prevencion es visual y silenciosa

> Incluido en "Design - Hand Interaction States"

## UX-04: Disenar indicadores de accesibilidad

- Verificar en Pencil que cada estado visual usa mas de un indicador (no solo color):
  - Turno activo: color + texto "Tu turno" + borde
  - Mano seleccionada: color + borde + escala
  - Mano eliminada: color + opacidad + icono diferente
  - Objetivo valido: color + borde pulsante
- Verificar contraste de colores WCAG AA en todos los estados
- Numeros de dedos legibles en todos los estados

> Pantalla: "Design - Accessibility Check" en fichero `.pen`

## UX-05: Disenar microinteraccion de operacion durante ataque

- Disenar un indicador visual breve que muestre la operacion del ataque
- Ejemplo: "+2" aparece brevemente sobre la mano objetivo al recibir el ataque
- El indicador desaparece rapidamente (500-800ms)
- Es informativo y ayuda a entender que paso, especialmente para nuevos jugadores
- Opcional: puede omitirse si satura la interfaz

> Pantalla: "Design - Attack Microinteraction" en fichero `.pen`
