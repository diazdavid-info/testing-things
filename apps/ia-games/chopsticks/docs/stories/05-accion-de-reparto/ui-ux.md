# Story 05 — Tareas de UI/UX (Pencil)

## UX-01: Disenar panel de opciones de reparto

- Disenar en Pencil el panel o modal que aparece al pulsar "Repartir"
- El panel muestra las distribuciones validas como opciones seleccionables
- Cada opcion se muestra como un par: [izquierda, derecha]
  - Ejemplo: botones con "2 | 2", "3 | 1", "1 | 3"
- Usar representacion visual clara: iconos de manos con numeros, tarjetas, o botones grandes
- El panel debe tener un boton o gesto para cancelar y volver al estado normal del turno
- El panel no debe tapar completamente el tablero (el jugador debe ver el contexto)

> Pantalla: "Game - Split Panel" en fichero `.pen`

## UX-02: Disenar variante movil del panel de reparto

- Adaptar el panel de reparto a pantallas pequenas en Pencil
- Las opciones deben ser lo suficientemente grandes para tocar con el dedo (>= 44x44px)
- El panel puede ser un bottom sheet o modal que ocupa la parte inferior de la pantalla
- Boton "Cancelar" o gesto de swipe down para cerrar

> Pantalla: "Game - Split Panel Mobile" en fichero `.pen`

## UX-03: Disenar estado del boton "Repartir" habilitado y deshabilitado

- Disenar en Pencil los dos estados del boton "Repartir":
  - **Habilitado**: hay al menos un reparto valido. Color activo, interactivo
  - **Deshabilitado**: no hay repartos validos. Color gris, opacidad reducida, no interactivo
- Opcional: tooltip o texto breve que explique por que esta deshabilitado ("No hay repartos posibles")

> Incluido en pantallas "Game - Desktop" y "Game - Mobile"

## UX-04: Disenar resaltado de opcion de reparto que revive mano

- Dentro del panel de opciones, las distribuciones que reviven una mano muerta pueden tener un indicador especial
- Ejemplo: icono de "revivir", borde verde, o texto "Revive mano" junto a la opcion
- Este indicador es informativo, no cambia la mecanica

> Incluido en "Game - Split Panel"

## UX-05: Disenar resultado del reparto

- Disenar en Pencil como se muestra el resultado tras seleccionar un reparto
- Las manos del jugador actualizan sus valores con una transicion visual
- Si se revive una mano, la mano pasa de estado muerto a vivo con transicion clara
- El panel de reparto se cierra automaticamente
- El turno cambia al otro jugador

> Pantalla: "Game - Split Result" en fichero `.pen`
