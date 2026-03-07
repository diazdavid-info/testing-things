# Story 01 — Tareas de UI/UX (Pencil)

## UX-01: Disenar pantalla de inicio — Layout general

- Disenar la composicion de la pantalla de inicio completa
- Elementos a incluir:
  - Logo o titulo "El Molino" como elemento principal
  - Subtitulo breve que explique el juego (ej: "El clasico juego de estrategia para dos jugadores")
  - Boton primario "Crear partida"
  - Separador visual o texto "o"
  - Campo de texto con placeholder "Introduce el codigo" + boton "Unirse"
- Jerarquia visual: el boton "Crear partida" debe ser la accion principal y mas visible
- El bloque de "Unirse" es secundario pero igualmente accesible
- Centrado vertical y horizontal en pantalla

## UX-02: Disenar variante movil

- Adaptar el layout a pantallas pequenas (320px - 480px)
- Los elementos se apilan verticalmente
- El boton "Crear partida" ocupa todo el ancho disponible
- El campo de codigo + boton "Unirse" se muestran en una fila o apilados segun el espacio
- Asegurar que los targets tactiles tienen al menos 44x44px

## UX-03: Disenar estados de error

- Disenar como se muestran los mensajes de error debajo del campo de codigo:
  - "Codigo no encontrado" (404)
  - "Partida llena" (409)
  - "Esta partida ya ha terminado" (410)
- Color y estilo del mensaje de error (rojo suave, icono de alerta opcional)
- El mensaje aparece debajo del campo sin desplazar otros elementos
- Disenar estado de error generico por fallo de red

## UX-04: Disenar estados de carga

- Estado de carga del boton "Crear partida": texto cambia a "Creando..." o spinner, boton deshabilitado
- Estado de carga del boton "Unirse": texto cambia a "Conectando..." o spinner, boton deshabilitado
- El campo de texto se deshabilita durante la carga

## UX-05: Definir paleta de colores y tipografia base

- Definir la paleta de colores del juego:
  - Color primario (botones, acentos)
  - Color de fondo
  - Color de texto
  - Color de error
  - Color de elementos secundarios
- Definir la tipografia: familia, tamanos para titulo, subtitulo, cuerpo y botones
- Definir espaciado base (padding, gap, margenes)
- Este sistema visual se reutilizara en todas las pantallas del juego

## UX-06: Disenar ilustracion o grafico del tablero como elemento decorativo

- Incluir una representacion visual sutil del tablero del molino como fondo o elemento decorativo
- No debe competir con los elementos de accion (botones, campo)
- Puede ser una version simplificada, en tono claro o con opacidad baja
- Aporta identidad visual al juego desde la primera pantalla
