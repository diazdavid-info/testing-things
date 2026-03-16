# Story 06 — Tareas de desarrollo

## DEV-01: Logica de deteccion de victoria — Funcion `checkWinner`

- Implementar funcion `checkWinner(state)` que:
  - Comprueba si algun jugador tiene ambas manos a 0
  - Si el Jugador 1 tiene [0, 0], gana el Jugador 2
  - Si el Jugador 2 tiene [0, 0], gana el Jugador 1
  - Si ninguno tiene [0, 0], no hay ganador
- La funcion se ejecuta tras cada ataque (el reparto no puede producir [0, 0] propio)
- Actualiza el estado de la partida a `finished` y registra el ganador

**Tests:**
- Jugador 1 con [0, 0] → gana Jugador 2
- Jugador 2 con [0, 0] → gana Jugador 1
- Ambos con manos vivas → no hay ganador
- Jugador con [1, 0] → no hay ganador (una mano sigue viva)
- Jugador con [0, 3] → no hay ganador
- Tras detectar ganador, el estado de la partida es `finished`

## DEV-02: Bloqueo de acciones tras fin de partida

- Cuando la partida esta en estado `finished`:
  - No se pueden seleccionar manos
  - No se puede pulsar "Repartir"
  - No se puede ejecutar ningun ataque
  - Solo se puede pulsar "Revancha" o "Volver al inicio"
- El tablero queda en su estado final sin interactividad

**Tests:**
- En estado `finished`, click en manos no tiene efecto
- En estado `finished`, boton "Repartir" esta deshabilitado
- En estado `finished`, solo "Revancha" y "Volver al inicio" funcionan

## DEV-03: Overlay de victoria en UI

- Cuando `checkWinner` detecta un ganador, mostrar overlay de victoria
- El overlay se renderiza sobre el tablero (el tablero sigue visible de fondo)
- Muestra el mensaje "Gana Jugador X"
- Botones "Revancha" y "Volver al inicio"
- Estilos alineados con Pencil (UX-01, UX-02)
- El overlay aparece con una transicion suave

**Tests:**
- El overlay se muestra cuando la partida termina
- El mensaje muestra el jugador ganador correcto
- Los botones "Revancha" y "Volver al inicio" se renderizan
- El overlay no se muestra mientras la partida esta activa

## DEV-04: Funcionalidad de revancha

- Al pulsar "Revancha":
  - Se reinicia el estado a [1, 1] para ambos jugadores
  - El jugador que perdio empieza primero
  - La partida vuelve a estado `playing`
  - El overlay se cierra
- El reinicio es inmediato, sin pantalla intermedia

**Tests:**
- Al pulsar "Revancha", el estado vuelve a [1, 1] para ambos
- El jugador que perdio tiene el primer turno
- El estado de la partida es `playing`
- El overlay desaparece

## DEV-05: Volver al inicio

- Al pulsar "Volver al inicio", se navega a la pantalla principal (ruta raiz)
- No se guarda estado de la partida

**Tests:**
- Al pulsar "Volver al inicio", se navega a la ruta raiz
- No hay estado residual de la partida anterior

## DEV-06: Funcionalidad de reinicio durante la partida

- Al pulsar "Reiniciar" durante una partida activa:
  - El estado vuelve a [1, 1] para ambos
  - El turno vuelve al Jugador 1
  - La partida vuelve a estado `playing`
  - Si habia un panel de reparto abierto, se cierra
  - Si habia una mano seleccionada, se deselecciona
- No se pide confirmacion

**Tests:**
- "Reiniciar" devuelve estado a [1, 1] para ambos
- El turno vuelve al Jugador 1
- Panel de reparto se cierra si estaba abierto
- Seleccion de mano se limpia
- Funciona en cualquier momento de la partida
