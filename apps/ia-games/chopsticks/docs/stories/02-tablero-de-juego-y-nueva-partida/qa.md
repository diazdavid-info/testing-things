# Story 02 — Tareas de QA

---

## QA-DEV-01: Verificar modelo de estado

- El estado inicial se crea con [1, 1] para ambos jugadores
- El turno inicial es del Jugador 1
- El estado de partida es `playing`
- No hay ganador al inicio
- Los tests unitarios del modelo pasan correctamente

## QA-DEV-02: Verificar pagina del tablero

- Al pulsar "Nueva partida" desde la pantalla de inicio, se navega al tablero
- Se muestran las 4 manos con valor 1
- Se muestra el indicador de turno del Jugador 1
- Se muestra el boton "Repartir"
- Se muestra el boton "Reiniciar"

## QA-DEV-03: Verificar componente de mano

- Cada mano muestra su valor numerico de forma clara
- Las manos con valor > 0 se ven como activas
- Las manos con valor 0 se ven como eliminadas (para probar: forzar estado)
- Los numeros son legibles en pantallas pequenas

## QA-DEV-04: Verificar indicador de turno

- Al inicio, el area del Jugador 1 esta destacada
- El texto "Tu turno" es visible junto al Jugador 1
- El Jugador 2 se muestra con menor enfasis

## QA-DEV-05: Verificar boton "Reiniciar"

- Al pulsar "Reiniciar", el estado vuelve a [1, 1] para ambos
- El turno vuelve al Jugador 1
- Funciona en cualquier momento de la partida

## QA-DEV-06: Verificar responsive del tablero

- Probar en viewports: 320px, 375px, 414px, 768px, 1024px, 1440px
- Las manos son suficientemente grandes para interactuar con el dedo
- No hay scroll horizontal
- No hay texto cortado ni elementos solapados
- Boton "Repartir" y "Reiniciar" accesibles en todos los viewports

---

## QA-UX-01: Verificar diseno del tablero desktop

- Comparar la implementacion con "Game - Desktop" en el fichero `.pen`
- Disposicion correcta: rival arriba, jugador abajo
- Manos con tamano y posicion correctos
- Indicador de turno visible y claro
- Botones "Repartir" y "Reiniciar" bien posicionados

## QA-UX-02: Verificar diseno del tablero movil

- Comparar con "Game - Mobile" en el fichero `.pen`
- Las manos son grandes y tactiles
- El tablero es usable con una sola mano
- Los numeros de dedos son legibles sin esfuerzo

## QA-UX-03: Verificar representacion de manos

- Comparar con "Game - Hand States" en el fichero `.pen`
- Los 4 estados (1, 2, 3, 4 dedos) se ven claramente distintos
- El valor numerico es el elemento mas visible
- Las manos se ven interactivas (invitan al tap/click)

## QA-UX-04: Verificar indicador de turno

- Se distingue claramente de quien es el turno
- El area del jugador activo destaca sobre la del que espera
- No se usa solo el color para indicar el turno

---

## QA-SEO-01: Verificar metadatos

- `<title>` contiene "Partida" y el nombre del juego
- `<meta name="description">` presente

## QA-SEO-02: Verificar estructura semantica

- Cada area de jugador tiene `aria-label` descriptivo
- Las manos tienen `aria-label` con su valor
- El indicador de turno tiene `role="status"`

## QA-MKT-01: Verificar eventos de analytics

- Evento `game_started` definido como stub
- Evento `game_restarted` definido como stub
