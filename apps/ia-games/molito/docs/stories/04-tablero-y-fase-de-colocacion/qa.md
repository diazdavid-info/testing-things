# Story 04 — Tareas de QA

## QA-01: Renderizado del tablero

- [ ] El tablero muestra 3 cuadrados concentricos con lineas de conexion
- [ ] Se ven 24 posiciones interactivas en las intersecciones correctas
- [ ] Las posiciones vacias se muestran como circulos vacios
- [ ] Las fichas de jugador 1 y jugador 2 tienen colores claramente distintos
- [ ] El tablero se centra correctamente en la pantalla

## QA-02: Colocacion de fichas

- [ ] Jugador 1 puede colocar ficha en posicion vacia durante su turno
- [ ] Tras colocar, el turno cambia a jugador 2
- [ ] Jugador 2 puede colocar ficha en posicion vacia durante su turno
- [ ] No se puede colocar en posicion ocupada (mensaje de error)
- [ ] No se puede colocar fuera de turno (mensaje de error)
- [ ] Las fichas aparecen con el color correcto del jugador

## QA-03: Contadores de fichas

- [ ] Al inicio, ambos jugadores muestran 9 fichas por colocar
- [ ] Tras colocar, el contador de "por colocar" baja en 1
- [ ] Tras colocar, el contador de "en tablero" sube en 1
- [ ] Los contadores se actualizan inmediatamente tras cada colocacion

## QA-04: Indicador de turno

- [ ] Muestra "Tu turno" cuando es el turno del jugador local
- [ ] Muestra "Turno del rival" cuando es turno del otro
- [ ] Se actualiza correctamente tras cada colocacion
- [ ] El indicador tiene diferencia visual clara (color, icono)

## QA-05: Transicion de fase

- [ ] Tras colocar la ficha 18 (ambos jugadores agotan sus 9 fichas), la fase cambia a "Movimiento"
- [ ] El badge de fase se actualiza de "Colocacion" a "Movimiento"
- [ ] Las posiciones vacias ya no son clicables en fase de movimiento

## QA-06: Deteccion de molinos

- [ ] Al formar una linea de 3 fichas propias, se detecta como molino
- [ ] El turno NO cambia automaticamente cuando se forma un molino (se espera eliminacion de ficha — Story 05)
- [ ] Molinos horizontales, verticales y entre cuadrados se detectan correctamente

## QA-07: Responsive

- [ ] Desktop (1440px): tablero a la izquierda, panel info a la derecha
- [ ] Tablet (768px): layout adapta proporcionalmente
- [ ] Mobile (375px): tablero arriba, panel info debajo
- [ ] Las posiciones del tablero son lo suficientemente grandes para tap en mobile (min 44px)
- [ ] El tablero no desborda la pantalla en ningun breakpoint

## QA-08: Interacciones

- [ ] Hover sobre posicion vacia (tu turno): efecto visual de resalte
- [ ] Hover sobre posicion vacia (no tu turno): sin efecto
- [ ] Cursor pointer en posiciones clicables, default en las demas
- [ ] Click rapido no duplica la peticion (debounce o disable temporal)

## QA-09: Accesibilidad

- [ ] Las posiciones del tablero son accesibles con teclado (tab navigation)
- [ ] Cada posicion tiene un aria-label descriptivo ("Posicion 1, vacia" / "Posicion 1, ficha Jugador 1")
- [ ] El indicador de turno tiene role adecuado para lectores de pantalla
- [ ] Los contadores son anunciados al actualizar
