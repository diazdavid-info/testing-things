# Story 07 — Tareas de desarrollo

## DEV-01: Pagina de tutorial

- Crear la ruta de la pantalla de tutorial (ej: `/como-jugar` o `/tutorial`)
- Renderizar el contenido del tutorial segun el diseno de Pencil (UX-01, UX-02)
- Estructura del contenido:
  - Objetivo del juego
  - Estado inicial
  - Explicacion del ataque con ejemplo
  - Explicacion del reparto con ejemplo
  - Condicion de victoria
- Boton "Volver" que navega a la pantalla de inicio
- Aplicar estilos responsive (desktop y movil)

**Tests:**
- La pagina se renderiza correctamente en la ruta del tutorial
- El contenido incluye las secciones esperadas (objetivo, ataque, reparto, victoria)
- El boton "Volver" navega a la pantalla de inicio
- La pagina es accesible y navegable por teclado

## DEV-02: Componente de ejemplo visual de ataque

- Crear componente que ilustre el ejemplo de ataque
- Muestra el estado antes y despues con representacion visual de manos
- Incluye la operacion: "2 + 3 = 5 → Eliminada"
- Estilos alineados con Pencil (UX-03)
- El componente es estatico (no interactivo)

**Tests:**
- El componente se renderiza con los valores correctos del ejemplo
- Los estados "antes" y "despues" son visibles

## DEV-03: Componente de ejemplo visual de reparto

- Crear componente que ilustre el ejemplo de reparto con revival
- Muestra el estado antes [4, 0] y despues [2, 2]
- La mano muerta se ve como eliminada antes y como viva despues
- Estilos alineados con Pencil (UX-04)
- El componente es estatico (no interactivo)

**Tests:**
- El componente se renderiza con los valores correctos del ejemplo
- La mano muerta y la mano revivida se ven correctamente

## DEV-04: Overlay de ayuda desde el tablero

- Agregar boton de ayuda (icono ?) en la pantalla de juego
- Al pulsar, se abre un overlay con reglas resumidas
- El overlay no interrumpe la partida (el estado se mantiene)
- Boton para cerrar el overlay y volver a la partida
- Estilos alineados con Pencil (UX-05)
- El overlay tiene `role="dialog"` y `aria-modal="true"`

**Tests:**
- Al pulsar el boton de ayuda, el overlay se abre
- Al cerrar el overlay, la partida continua en su estado anterior
- El estado de la partida no cambia al abrir/cerrar la ayuda
- El overlay es accesible por teclado

## DEV-05: Navegacion entre inicio y tutorial

- Desde la pantalla de inicio, "Como jugar" lleva al tutorial
- Desde el tutorial, "Volver" lleva a la pantalla de inicio
- La navegacion funciona correctamente en ambos sentidos

**Tests:**
- Navegacion inicio → tutorial funciona
- Navegacion tutorial → inicio funciona
- No hay estados residuales al navegar
