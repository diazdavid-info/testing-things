# Story 01 — Tareas de UI/UX (Pencil)

## UX-01: Disenar pantalla de inicio — Layout general

- Disenar la composicion de la pantalla de inicio completa en Pencil
- Elementos a incluir:
  - Logo o titulo "Juego de los Dedos" como elemento principal
  - Subtitulo breve que explique el juego (ej: "El clasico juego de manos para dos jugadores")
  - Boton primario "Nueva partida" destacado como accion principal
  - Boton secundario "Como jugar"
- Jerarquia visual: "Nueva partida" debe ser la accion mas visible y grande
- "Como jugar" es secundario pero igualmente accesible
- Centrado vertical y horizontal en pantalla
- Estilo visual amigable y atractivo para ninos a partir de 6-7 anos
- Usar iconografia o ilustracion de manos/dedos como elemento de identidad

> Pantalla: "Home - Desktop" en fichero `.pen`

## UX-02: Disenar variante movil

- Adaptar el layout a pantallas pequenas (320px - 480px) en Pencil
- Los elementos se apilan verticalmente
- Los botones ocupan todo el ancho disponible
- Asegurar que los targets tactiles tienen al menos 44x44px (52px de alto en botones)
- Mantener el estilo visual amigable y legible en pantallas pequenas

> Pantalla: "Home - Mobile" en fichero `.pen`

## UX-03: Definir paleta de colores y tipografia base

- Definir paleta de colores como variables en Pencil:
  - Color primario / accent
  - Color de fondo principal
  - Color de superficie (cards, modales)
  - Colores de texto (primario, secundario, muted)
  - Colores de jugadores (Jugador 1, Jugador 2) claramente distinguibles
  - Color de mano eliminada
  - Color de error
  - Color de bordes
- Tipografia: elegir fuentes legibles y amigables (titulos y cuerpo)
- Espaciado base entre secciones y padding de contenedores

## UX-04: Disenar ilustracion o elemento decorativo

- Disenar en Pencil un elemento decorativo que refuerce la identidad del juego
- Opciones: ilustracion de manos con dedos, icono abstracto, patron de fondo
- El elemento debe ser sutil y no competir con el contenido principal
- Debe funcionar tanto en desktop como en movil (o solo en desktop si es demasiado grande)
