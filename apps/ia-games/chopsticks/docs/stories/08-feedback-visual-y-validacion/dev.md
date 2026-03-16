# Story 08 — Tareas de desarrollo

## DEV-01: Estados de interaccion del componente de mano

- Implementar todos los estados visuales del componente de mano segun Pencil (UX-01):
  - Normal, hover/focus, seleccionada, objetivo valido, eliminada, no interactiva
- Aplicar clases CSS o variantes de estilo segun el estado
- Las transiciones entre estados deben ser suaves (200-400ms)
- Estilos alineados con Pencil (UX-01)

**Tests:**
- El componente aplica la clase correcta segun cada estado
- El estado "hover" se activa al pasar el raton (o focus por teclado)
- El estado "seleccionada" se aplica al tocar
- El estado "eliminada" se aplica con valor 0
- El estado "no interactiva" se aplica cuando no es turno del jugador

## DEV-02: Transiciones animadas de cambio de valor

- Implementar transiciones CSS/JS para cambios de valor en las manos:
  - Cambio numerico: el numero cambia con transicion suave
  - Eliminacion: transicion a estado muerto (opacidad, cambio de icono)
  - Revival: transicion de muerto a vivo (opacidad, cambio de icono)
  - Cambio de turno: transicion de enfasis entre areas
- Las transiciones no deben bloquear la interaccion siguiente
- Duracion: 200-400ms segun Pencil (UX-02)

**Tests:**
- Los cambios de valor aplican transiciones (no son instantaneos)
- Las transiciones tienen la duracion esperada
- Tras la transicion, el estado final es correcto

## DEV-03: Prevencion de acciones invalidas

- Consolidar la validacion de todas las acciones del juego:
  - No se puede interactuar con manos del rival al seleccionar atacante
  - No se puede interactuar con manos muertas
  - No se puede interactuar cuando no es tu turno
  - No se puede interactuar cuando la partida ha terminado
  - Pulsaciones rapidas consecutivas no producen estados inconsistentes
- Las acciones invalidas son silenciosas: no ocurre nada, sin mensajes de error
- Implementar debounce o bloqueo temporal durante la resolucion de una accion

**Tests:**
- Click en mano muerta no tiene efecto
- Click en mano rival antes de seleccionar atacante no tiene efecto
- Click en cualquier mano fuera de turno no tiene efecto
- Click en mano durante partida terminada no tiene efecto
- Doble click rapido solo ejecuta una accion
- Pulsaciones rapidas durante transicion no rompen el estado

## DEV-04: Microinteraccion de operacion durante ataque

- Mostrar indicador breve "+N" sobre la mano objetivo al recibir un ataque
- El indicador aparece con una animacion sutil (fade in + move up)
- Desaparece automaticamente tras 500-800ms
- Estilos alineados con Pencil (UX-05)
- Si se decide omitir (UX-05 es opcional), este DEV tambien se omite

**Tests:**
- Al ejecutar ataque, el indicador "+N" aparece sobre la mano objetivo
- El valor de N corresponde al valor de la mano atacante
- El indicador desaparece tras el tiempo definido

## DEV-05: Accesibilidad transversal

- Verificar y completar la accesibilidad en toda la aplicacion:
  - Todas las manos tienen `aria-label` descriptivo con valor y estado
  - El indicador de turno tiene `role="status"` y se actualiza para lectores de pantalla
  - Los overlays (victoria, ayuda, reparto) tienen `role="dialog"` y `aria-modal="true"`
  - Navegacion completa por teclado: Tab entre elementos interactivos, Enter/Space para activar
  - Focus visible en todos los elementos interactivos
  - No se depende solo del color para comunicar estados
- Contraste WCAG AA en todos los textos y elementos interactivos

**Tests:**
- Todos los elementos interactivos son alcanzables por Tab
- Los `aria-label` reflejan el estado actual de cada mano
- `role="status"` presente en el indicador de turno
- Focus visible en todos los botones y manos
- Contraste de colores cumple WCAG AA (verificar con herramienta automatizada)

## DEV-06: Optimizacion de rendimiento

- Las transiciones usan `transform` y `opacity` (no propiedades que causan reflow)
- El re-renderizado del estado es eficiente: solo se actualizan los componentes que cambian
- No hay memory leaks en los timers de microinteracciones
- El juego funciona fluido en dispositivos moviles de gama media

**Tests:**
- No hay errores en consola durante una partida completa
- Las transiciones no causan jank visual (verificar con DevTools Performance)
- Los timers se limpian correctamente al desmontar componentes
