# Story 04 — Tareas de UI/UX (Pencil)

## ~~UX-01: Disenar tablero del Molino — Desktop~~ ✅

- Tablero clasico con 3 cuadrados concentricos y lineas de conexion
- 24 posiciones como circulos interactivos
- Colores del tablero coherentes con el design system (lineas sutiles, fondo claro)
- Fichas de jugador 1: color amber/warm (#C8702A o derivado)
- Fichas de jugador 2: color oscuro (#1A1A1A o derivado)
- Posiciones vacias: circulos con borde sutil
- El tablero debe ser el elemento dominante de la pantalla
- Tamano de tablero: ~480x480px en desktop

> Disenado en Pencil: nodo `piSDH` (Game Desktop). Tablero SVG con 3 cuadrados, 4 lineas cruzadas, 24 posiciones con fichas de ejemplo.

## ~~UX-02: Disenar tablero del Molino — Mobile~~ ✅

- El tablero ocupa el ancho disponible (con padding)
- Las posiciones deben ser lo suficientemente grandes para tap (min 44px)
- El tablero se centra horizontalmente
- Debajo del tablero va el panel de informacion

> Disenado en Pencil: nodo `EW9NV` (Game Mobile). Tablero 343x343px adaptado, info panel compacto debajo.

## ~~UX-03: Disenar panel de informacion de partida~~ ✅

- Dos variantes: desktop (lateral al tablero) y mobile (debajo)
- Elementos:
  - Indicador de turno prominente ("Tu turno" / "Turno del rival")
  - Badge de fase: "Colocacion"
  - Contadores de fichas por jugador
  - Colores de fichas como referencia visual
- El indicador de turno es el elemento mas importante del panel

> Disenado en ambas pantallas. Desktop: card lateral con secciones Jugador 1/2. Mobile: compacto con fila de stats.

## ~~UX-04: Disenar estados de hover y seleccion~~ ✅

- Hover sobre posicion vacia (tu turno): circulo se agranda ligeramente o cambia opacidad
- Hover sobre posicion vacia (no tu turno): cursor default, sin cambio visual
- Posicion ocupada: sin interaccion hover
- Feedback tras colocar: breve flash o animacion de aparicion de la ficha

> Implementado en Board.astro con CSS transitions, cursor pointer, hover opacity.

## ~~UX-05: Disenar layout completo de partida — Desktop~~ ✅

- Layout horizontal: tablero a la izquierda/centro, panel info a la derecha
- El tablero es el foco principal (~60-70% del ancho)
- El panel info ocupa el espacio restante

> Disenado en Pencil: nodo `piSDH`. Layout flex horizontal con tablero 540px + panel 360px.

## ~~UX-06: Disenar layout completo de partida — Mobile~~ ✅

- Layout vertical: tablero arriba, panel info debajo
- El tablero ocupa ancho completo (con padding)
- El panel info se apila debajo con separacion visual

> Disenado en Pencil: nodo `EW9NV`. Layout vertical con gap 16px.
