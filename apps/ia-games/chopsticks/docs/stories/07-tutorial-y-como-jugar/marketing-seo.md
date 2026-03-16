# Story 07 — Tareas de marketing y SEO

## SEO-01: Metadatos de la pagina de tutorial

- `<title>`: "Como jugar — Juego de los Dedos"
- `<meta name="description">`: descripcion de las reglas del juego para SEO
- La pagina de tutorial puede posicionar para busquedas como "reglas juego de los dedos", "como jugar chopsticks"
- Mantener `<html lang="es">`

## SEO-02: Estructura semantica del tutorial

- Usar `<article>` o `<main>` para el contenido del tutorial
- Headings jerarquicos: `<h1>` para titulo, `<h2>` para cada seccion
- Imagenes o ilustraciones con `alt` descriptivo
- El contenido debe ser indexable y legible por crawlers

## MKT-01: Copywriting del tutorial

- Titulo: "Como jugar"
- Textos breves y directos para cada seccion:
  - Objetivo: 1-2 frases
  - Ataque: 2-3 frases + ejemplo
  - Reparto: 2-3 frases + ejemplo
  - Victoria: 1-2 frases
- Tono amigable, comprensible para ninos a partir de 6-7 anos
- Evitar jerga o terminos tecnicos
- Los ejemplos deben usar numeros concretos, no abstracciones

## MKT-02: Eventos de analytics del tutorial

- Definir eventos:
  - `tutorial_opened`: cuando se accede al tutorial (desde inicio o desde tablero)
  - `tutorial_closed`: cuando se cierra o se vuelve al inicio
  - `help_overlay_opened`: cuando se abre la ayuda desde el tablero
  - `help_overlay_closed`: cuando se cierra la ayuda desde el tablero
- Registrar como stubs para futuro uso
