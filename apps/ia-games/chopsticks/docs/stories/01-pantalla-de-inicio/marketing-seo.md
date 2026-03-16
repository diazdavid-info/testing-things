# Story 01 — Tareas de marketing y SEO

## SEO-01: Metadatos basicos de la pagina

- `<title>`: "Juego de los Dedos — El clasico juego de manos para dos jugadores"
- `<meta name="description">`: texto con propuesta de valor del juego
- `<meta name="keywords">`: juego de los dedos, chopsticks, juego de manos, juego para dos, juego de turnos
- `<html lang="es">`

## SEO-02: Open Graph y redes sociales

- `og:title`, `og:description`, `og:type` configurados
- `twitter:card`, `twitter:title`, `twitter:description` configurados
- `og:image` y `twitter:image` pendientes de imagen de preview (SEO-03)

## SEO-03: Imagen de preview social — PENDIENTE

- Crear imagen de 1200x630px para preview en redes sociales
- Debe incluir: nombre del juego, ilustracion de manos, llamada a la accion
- Una vez creada, referenciar en `og:image` y `twitter:image`

## SEO-04: Favicon e iconos

- Crear favicon SVG representativo del juego (icono de mano o dedos)
- Referenciar en `<link rel="icon">`
- `apple-touch-icon.png` pendiente para futuras iteraciones

## SEO-05: Estructura semantica del HTML

- `<main>` para contenido principal
- `<h1>` unico para "Juego de los Dedos"
- `<button>` para todas las acciones
- Pagina indexable (sin noindex ni bloqueos)

## SEO-06: Rendimiento y Core Web Vitals

- Minimo JS: solo lo imprescindible para la navegacion
- Fuentes con `display=swap`
- LCP < 2.5s, CLS < 0.1, FID < 100ms
- Performance score >= 90 en Lighthouse

## MKT-01: Copywriting de la pantalla de inicio

- Titulo: "Juego de los Dedos"
- Subtitulo: texto breve que enganche y explique el juego
- Boton principal: "Nueva partida"
- Boton secundario: "Como jugar"
- Tono amigable, comprensible para ninos y adultos
- Sin errores ortograficos ni gramaticales

## MKT-02: Preparacion para analytics

- Definir eventos basicos:
  - `page_view`
  - `click_new_game`
  - `click_how_to_play`
- Funcion `trackEvent()` como stub (no-op) para futuro uso
- Ningun script de analytics cargado aun
