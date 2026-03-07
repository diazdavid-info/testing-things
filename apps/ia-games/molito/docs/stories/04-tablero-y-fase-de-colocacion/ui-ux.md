# Story 04 — Tareas de UI/UX (Pencil)

## UX-01: Disenar tablero del Molino — Desktop

- Tablero clasico con 3 cuadrados concentricos y lineas de conexion
- 24 posiciones como circulos interactivos
- Colores del tablero coherentes con el design system (lineas sutiles, fondo claro)
- Fichas de jugador 1: color amber/warm (#C8702A o derivado)
- Fichas de jugador 2: color oscuro (#1A1A1A o derivado)
- Posiciones vacias: circulos con borde sutil
- El tablero debe ser el elemento dominante de la pantalla
- Tamano de tablero: ~480x480px en desktop

## UX-02: Disenar tablero del Molino — Mobile

- El tablero ocupa el ancho disponible (con padding)
- Las posiciones deben ser lo suficientemente grandes para tap (min 44px)
- El tablero se centra horizontalmente
- Debajo del tablero va el panel de informacion

## UX-03: Disenar panel de informacion de partida

- Dos variantes: desktop (lateral al tablero) y mobile (debajo)
- Elementos:
  - Indicador de turno prominente ("Tu turno" / "Turno del rival")
  - Badge de fase: "Colocacion"
  - Contadores de fichas por jugador:
    - Fichas por colocar (iconos o numero)
    - Fichas en tablero
  - Colores de fichas como referencia visual junto al nombre del jugador
- El indicador de turno es el elemento mas importante del panel

## UX-04: Disenar estados de hover y seleccion

- Hover sobre posicion vacia (tu turno): circulo se agranda ligeramente o cambia opacidad
- Hover sobre posicion vacia (no tu turno): cursor default, sin cambio visual
- Posicion ocupada: sin interaccion hover
- Feedback tras colocar: breve flash o animacion de aparicion de la ficha

## UX-05: Disenar layout completo de partida — Desktop

- Layout horizontal: tablero a la izquierda/centro, panel info a la derecha
- El tablero es el foco principal (~60-70% del ancho)
- El panel info ocupa el espacio restante
- Fondo general coherente con el resto de la app

## UX-06: Disenar layout completo de partida — Mobile

- Layout vertical: tablero arriba, panel info debajo
- El tablero ocupa ancho completo (con padding)
- El panel info se apila debajo con separacion visual
- Todo visible sin scroll si es posible
