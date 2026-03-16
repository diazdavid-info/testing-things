# Story 07 — Tareas de UI/UX (Pencil)

## UX-01: Disenar pantalla de tutorial — Layout general

- Disenar en Pencil la pantalla completa de "Como jugar"
- Estructura del contenido en orden:
  1. Titulo: "Como jugar"
  2. Objetivo del juego (1-2 frases)
  3. Estado inicial con ilustracion de 4 manos en [1, 1]
  4. Explicacion de turnos (1 frase)
  5. Seccion "Atacar" con ejemplo visual
  6. Seccion "Repartir" con ejemplo visual
  7. Seccion "Victoria" (1-2 frases)
- Cada seccion usa iconos o ilustraciones simples de manos
- Estilo visual coherente con el resto del juego
- Boton "Volver" o flecha para regresar a la pantalla de inicio

> Pantalla: "Tutorial - Desktop" en fichero `.pen`

## UX-02: Disenar variante movil del tutorial

- Adaptar el tutorial a pantallas pequenas en Pencil
- El contenido se muestra en scroll vertical
- Las ilustraciones se adaptan al ancho de pantalla
- El boton "Volver" esta fijo arriba o es facilmente accesible
- Textos legibles sin zoom

> Pantalla: "Tutorial - Mobile" en fichero `.pen`

## UX-03: Disenar ejemplo visual de ataque

- Disenar en Pencil una ilustracion paso a paso del ataque:
  - Antes: "Tu mano: 2, Rival: 3"
  - Accion: flecha o indicador de "ataca"
  - Despues: "Rival: 5 → Eliminada (0)"
- Usar colores y flechas para que sea comprensible sin leer mucho texto
- Debe funcionar como imagen independiente (se entiende sin contexto)

> Incluido en "Tutorial - Desktop" y "Tutorial - Mobile"

## UX-04: Disenar ejemplo visual de reparto

- Disenar en Pencil una ilustracion del reparto con revival:
  - Antes: "Tus manos: [4, 0] (mano muerta)"
  - Accion: indicador de "repartir"
  - Despues: "Tus manos: [2, 2] (mano revive)"
- El revival debe ser el ejemplo principal porque es el caso mas interesante
- Usar colores para indicar mano muerta → mano viva

> Incluido en "Tutorial - Desktop" y "Tutorial - Mobile"

## UX-05: Disenar overlay de ayuda desde el tablero

- Disenar en Pencil un overlay o modal que muestre las reglas resumidas
- Se activa desde un boton de ayuda (icono ?) en la pantalla de juego
- Contenido mas breve que el tutorial completo: solo lo esencial
- Boton para cerrar y volver a la partida en curso
- No interrumpe la partida (el estado se mantiene)

> Pantalla: "Game - Help Overlay" en fichero `.pen`
