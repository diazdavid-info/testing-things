# Story 06 — Tareas de QA

---

## QA-DEV-01: Verificar deteccion de victoria

- Jugador 1 con [0, 0] → se detecta victoria del Jugador 2
- Jugador 2 con [0, 0] → se detecta victoria del Jugador 1
- Jugador con [1, 0] → no se detecta victoria (una mano sigue viva)
- La deteccion ocurre inmediatamente tras el ataque que produce [0, 0]
- Los tests unitarios de `checkWinner` pasan correctamente

## QA-DEV-02: Verificar bloqueo de acciones

- Tras fin de partida, tocar manos no tiene efecto
- Tras fin de partida, "Repartir" esta deshabilitado
- Solo "Revancha" y "Volver al inicio" son interactivos

## QA-DEV-03: Verificar overlay de victoria

- El overlay aparece cuando la partida termina
- Muestra "Gana Jugador 1" o "Gana Jugador 2" segun corresponda
- El tablero final es visible de fondo
- Los botones "Revancha" y "Volver al inicio" funcionan
- El overlay no aparece durante la partida activa

## QA-DEV-04: Verificar revancha

- Al pulsar "Revancha", el estado vuelve a [1, 1] para ambos
- El jugador que perdio empieza primero
- El overlay desaparece
- La partida se puede jugar normalmente desde el inicio

## QA-DEV-05: Verificar volver al inicio

- Al pulsar "Volver al inicio", se navega a la pantalla principal
- La pantalla de inicio se muestra correctamente
- No hay estado residual de la partida anterior

## QA-DEV-06: Verificar reinicio durante la partida

- "Reiniciar" a mitad de partida devuelve [1, 1] para ambos
- El turno vuelve al Jugador 1
- Funciona con panel de reparto abierto (se cierra)
- Funciona con mano seleccionada (se deselecciona)
- Funciona en cualquier estado del juego

## QA-DEV-07: Verificar fin de partida completo end-to-end

- Jugar una partida completa desde [1, 1] hasta que un jugador quede en [0, 0]
- Verificar que el overlay aparece correctamente
- Hacer revancha y jugar otra partida completa
- Verificar que todo funciona sin errores

---

## QA-UX-01: Verificar diseno del overlay de victoria

- Comparar con "Game - Victory Overlay" en fichero `.pen`
- Mensaje de victoria grande y claro
- Tablero visible de fondo
- Botones bien posicionados y distinguibles

## QA-UX-02: Verificar variante movil del overlay

- Comparar con "Game - Victory Overlay Mobile" en fichero `.pen`
- Botones ocupan ancho completo y son tactiles
- Mensaje legible en pantallas pequenas

## QA-UX-03: Verificar boton de reinicio

- El boton "Reiniciar" es visible pero no interfiere con el juego
- Su posicion coincide con el diseno de Pencil
- Es accesible pero discreto

## QA-UX-04: Verificar transicion de final

- La transicion entre la eliminacion de la ultima mano y el overlay es fluida
- No es abrupta ni demasiado lenta
- El jugador entiende que la partida ha terminado

---

## QA-MKT-01: Verificar eventos de analytics

- Evento `game_finished` definido como stub
- Evento `rematch_started` definido como stub
- Evento `return_to_home` definido como stub

## QA-MKT-02: Verificar copywriting

- Textos coinciden con lo definido en MKT-02
- Tono celebratorio y comprensible
- No hay errores ortograficos

## QA-MKT-03: Verificar accesibilidad del overlay

- El overlay tiene `role="dialog"` y `aria-modal="true"`
- El foco se mueve al overlay al aparecer
- Los botones son alcanzables por teclado
