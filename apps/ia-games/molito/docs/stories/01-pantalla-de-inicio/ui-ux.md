# Story 01 — Tareas de UI/UX (Pencil)

## ~~UX-01: Disenar pantalla de inicio — Layout general~~ DONE

- ~~Disenar la composicion de la pantalla de inicio completa~~
- ~~Elementos a incluir:~~
  - ~~Logo o titulo "El Molino" como elemento principal~~
  - ~~Subtitulo breve que explique el juego (ej: "El clasico juego de estrategia para dos jugadores")~~
  - ~~Boton primario "Crear partida"~~
  - ~~Separador visual o texto "o"~~
  - ~~Campo de texto con placeholder "Introduce el codigo" + boton "Unirse"~~
- ~~Jerarquia visual: el boton "Crear partida" debe ser la accion principal y mas visible~~
- ~~El bloque de "Unirse" es secundario pero igualmente accesible~~
- ~~Centrado vertical y horizontal en pantalla~~

> Pantalla: "Home - Desktop" (node `a5rgq`) en `molino.pen`

## ~~UX-02: Disenar variante movil~~ DONE

- ~~Adaptar el layout a pantallas pequenas (320px - 480px)~~
- ~~Los elementos se apilan verticalmente~~
- ~~El boton "Crear partida" ocupa todo el ancho disponible~~
- ~~El campo de codigo + boton "Unirse" se muestran apilados verticalmente, ancho completo~~
- ~~Asegurar que los targets tactiles tienen al menos 44x44px (52px de alto en botones)~~

> Pantalla: "Home - Mobile" (node `ywcWE`) en `molino.pen`

## ~~UX-03: Disenar estados de error~~ DONE

- ~~Disenar como se muestran los mensajes de error debajo del campo de codigo:~~
  - ~~"Codigo no encontrado" (404) — icono circle-alert~~
  - ~~"Partida llena" (409) — icono users~~
  - ~~"Esta partida ya ha terminado" (410) — icono timer~~
- ~~Color y estilo del mensaje de error (fondo #FEF2F2, borde #FECACA, texto $color-error)~~
- ~~El mensaje aparece debajo del campo sin desplazar otros elementos~~
- ~~Input con borde rojo en estado de error~~

> Pantalla: "Home - Error States" (node `KxGDc`) en `molino.pen`

## ~~UX-04: Disenar estados de carga~~ DONE

- ~~Estado de carga del boton "Crear partida": texto cambia a "Creando...", boton con opacidad reducida~~
- ~~Estado de carga del boton "Unirse": texto cambia a "Conectando...", boton con opacidad reducida~~
- ~~El campo de texto se deshabilita durante la carga (opacidad reducida)~~

> Pantalla: "Home - Loading States" (node `MEAFZ`) en `molino.pen`

## ~~UX-05: Definir paleta de colores y tipografia base~~ DONE

- ~~Paleta de colores definida como variables en molino.pen:~~
  - ~~Primario: $accent-primary (#C8702A)~~
  - ~~Fondo: $bg-primary (#FBF8F4)~~
  - ~~Superficie: $bg-surface (#FFFFFF)~~
  - ~~Texto: $text-primary (#1A1A1A), $text-secondary (#6B6B6B), $text-muted (#A0A0A0)~~
  - ~~Error: $color-error (#DC3545)~~
  - ~~Bordes: $border (#E5E0DA)~~
  - ~~Jugadores: $player-1 (#1A1A1A), $player-2 (#C8702A)~~
- ~~Tipografia: Space Grotesk (titulos, botones), Inter (cuerpo, labels)~~
- ~~Espaciado: gap 24-40px entre secciones, padding 48px en card desktop, 28-40px en movil~~

## ~~UX-06: Disenar ilustracion o grafico del tablero como elemento decorativo~~ DONE

- ~~Dos tableros decorativos del molino (3 cuadrados concentricos + lineas conectoras)~~
- ~~Posicionados en esquinas opuestas (izquierda-arriba y derecha-abajo)~~
- ~~Opacidad muy baja (3-5%) para no competir con el contenido~~
- ~~Aportan identidad visual sin distraer~~

> Elementos: "Board Decoration" y "Board Decoration 2" en pantalla desktop
