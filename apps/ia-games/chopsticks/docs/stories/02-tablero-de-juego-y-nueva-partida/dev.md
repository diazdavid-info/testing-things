# Story 02 — Tareas de desarrollo

## DEV-01: Modelo de estado de la partida

- Definir la estructura de datos del estado del juego:
  - Jugador 1: `{ left: number, right: number }`
  - Jugador 2: `{ left: number, right: number }`
  - Turno actual: `player1 | player2`
  - Estado de la partida: `playing | finished`
  - Ganador (si aplica)
- Funcion para crear el estado inicial: ambos jugadores con [1, 1], turno del Jugador 1
- La logica de estado debe estar desacoplada de la UI

**Tests:**
- El estado inicial se crea correctamente con [1, 1] para ambos jugadores
- El turno inicial es del Jugador 1
- El estado de partida es `playing`
- No hay ganador al inicio

## DEV-02: Pagina del tablero de juego

- Crear la ruta de la pantalla de juego
- Al navegar desde "Nueva partida", se carga el tablero con el estado inicial
- Renderizar el layout del tablero segun el diseno de Pencil (UX-01, UX-02):
  - Area del rival arriba
  - Area del jugador abajo
  - Indicador de turno

**Tests:**
- La pagina se renderiza correctamente
- Se muestran las 4 manos con valor 1
- El indicador de turno muestra Jugador 1

## DEV-03: Componente de mano

- Crear componente reutilizable que represente una mano
- Props: valor (0-4), estado (viva/muerta), seleccionable (si/no), seleccionada (si/no)
- Muestra el numero de dedos de forma clara y grande
- Estilos alineados con el diseno de Pencil (UX-03)
- Variante visual segun estado: viva activa, viva no seleccionable, muerta

**Tests:**
- Renderiza correctamente con valores 0, 1, 2, 3, 4
- Muestra estado viva cuando valor > 0
- Muestra estado muerta cuando valor = 0
- Aplica estilo de seleccionada cuando corresponde
- No es interactiva cuando no es seleccionable

## DEV-04: Indicador de turno

- Mostrar de quien es el turno con texto y estilo visual
- El area del jugador activo se destaca (fondo, borde, opacidad del rival reducida)
- Texto "Tu turno" visible junto al jugador activo
- Estilos alineados con el diseno de Pencil (UX-04)

**Tests:**
- Muestra "Tu turno" en el area del jugador activo
- El jugador no activo se muestra con menor enfasis
- Al cambiar de turno, el indicador se actualiza correctamente

## DEV-05: Boton "Repartir" (estado deshabilitado)

- Renderizar boton "Repartir" en la zona de acciones
- En esta story, solo se muestra el boton (la logica de reparto se implementa en Story 05)
- El boton se muestra habilitado o deshabilitado segun si hay repartos validos
- Conectar con la funcion `getValidSplits()` que se implementara en Story 05

**Tests:**
- El boton se renderiza con el texto "Repartir"
- El boton se muestra visualmente en la pantalla de juego

## DEV-06: Boton "Reiniciar"

- Renderizar boton "Reiniciar" de forma discreta
- Al pulsar, reinicia el estado a [1, 1] para ambos jugadores, turno del Jugador 1
- No se pide confirmacion

**Tests:**
- El boton se renderiza correctamente
- Al pulsar, el estado vuelve a [1, 1] para ambos
- El turno vuelve al Jugador 1
- La partida vuelve a estado `playing`

## DEV-07: Responsive del tablero

- Aplicar los estilos responsive segun disenos de Pencil (UX-01 desktop, UX-02 movil)
- Las manos tienen target tactil minimo de 44x44px
- El tablero es usable en pantallas de 320px de ancho

**Tests:**
- Los componentes se renderizan sin errores a diferentes anchos
- Los botones tienen tamano minimo de interaccion
