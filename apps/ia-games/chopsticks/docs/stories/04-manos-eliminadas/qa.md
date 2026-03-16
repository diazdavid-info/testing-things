# Story 04 — Tareas de QA

---

## QA-DEV-01: Verificar logica de eliminacion

- Ataque que resulta en exactamente 5 → mano pasa a 0
- Ataque que resulta en 6, 7 u 8 → mano pasa a 0
- `isHandAlive(0)` devuelve `false`
- `isPlayerEliminated` con [0, 0] devuelve `true`
- `isPlayerEliminated` con [1, 0] devuelve `false`
- Los tests unitarios pasan correctamente

## QA-DEV-02: Verificar estado visual de mano eliminada

- Mano con valor 0 se ve claramente distinta de una mano viva
- Se usan multiples indicadores (no solo color): opacidad, icono, tachado
- El numero 0 es visible
- La mano no parece interactiva (sin hover, sin cursor pointer)

## QA-DEV-03: Verificar restricciones de interaccion

- Tocar mano muerta propia no la selecciona
- Tocar mano muerta rival no ejecuta ataque
- Las manos muertas no se resaltan como interactivas en ningun paso del flujo

## QA-DEV-04: Verificar comportamiento con una mano viva

- Jugador con [3, 0]: solo puede seleccionar la mano de valor 3
- Rival atacando a jugador con [0, 2]: solo puede apuntar a la mano de valor 2
- El flujo de ataque funciona normalmente con una sola mano viva

## QA-DEV-05: Verificar eliminacion consecutiva

- Eliminar una mano y luego la otra del mismo jugador en turnos consecutivos
- El estado final del jugador eliminado es [0, 0]
- Ambas manos se ven como eliminadas

---

## QA-UX-01: Verificar diseno de mano eliminada

- Comparar con "Game - Dead Hand" en fichero `.pen`
- La mano muerta se distingue claramente de la viva
- Multiples indicadores visuales (no solo color)
- El numero 0 es visible pero discreto

## QA-UX-02: Verificar transicion de eliminacion

- Comparar con "Game - Hand Death Transition" en fichero `.pen`
- La transicion es perceptible pero rapida
- El jugador entiende que la mano acaba de morir

## QA-UX-03: Verificar tablero con una mano muerta

- Comparar con "Game - One Hand Dead" en fichero `.pen`
- La mano muerta ocupa su espacio pero se ve inactiva
- La mano viva restante se ve claramente activa

## QA-UX-04: Verificar tablero con ambas manos muertas

- Comparar con "Game - Both Hands Dead" en fichero `.pen`
- Ambas manos se ven eliminadas
- El estado visual es impactante y claro

---

## QA-MKT-01: Verificar eventos de analytics

- Evento `hand_eliminated` definido como stub

## QA-MKT-02: Verificar accesibilidad

- Manos eliminadas tienen `aria-label` que indica "eliminada"
- El estado es distinguible sin depender solo del color
