# Story 01 — Tareas de marketing y SEO

## SEO-01: Metadatos basicos de la pagina

- Configurar `<title>`: "El Molino — Juega al clasico juego de estrategia online"
- Configurar `<meta name="description">`: "Juega al Molino (Nine Men's Morris) online con tus amigos. Crea una partida, comparte el codigo y empieza a jugar en segundos. Sin registro."
- Configurar `<meta name="keywords">`: "molino, nine men's morris, juego de mesa online, juego de estrategia, jugar con amigos, multijugador"
- Configurar `<html lang="es">`

## SEO-02: Open Graph y redes sociales

- Configurar etiquetas Open Graph para que al compartir el link se vea bien:
  - `og:title`: "El Molino — Juego de estrategia online"
  - `og:description`: "Crea una partida y reta a un amigo. Sin registro, directo al juego."
  - `og:image`: imagen de preview del juego (tablero con fichas o logo)
  - `og:type`: "website"
  - `og:url`: URL canonica del juego
- Configurar etiquetas Twitter Card:
  - `twitter:card`: "summary_large_image"
  - `twitter:title`, `twitter:description`, `twitter:image`

## SEO-03: Imagen de preview social

- Crear una imagen de 1200x630px para usar como preview en redes sociales
- Debe incluir: nombre del juego, representacion visual del tablero, llamada a la accion ("Juega ahora")
- Formato: PNG o JPG optimizado
- Esta imagen se usa en `og:image` y `twitter:image`

## SEO-04: Favicon e iconos

- Crear favicon del juego (representacion minima del tablero o de una ficha)
- Generar iconos para diferentes plataformas:
  - `favicon.ico` (32x32)
  - `apple-touch-icon.png` (180x180)
  - `icon-192.png` y `icon-512.png` para PWA (si aplica en el futuro)
- Configurar en el `<head>` de la pagina

## SEO-05: Estructura semantica del HTML

- Usar etiquetas semanticas correctas:
  - `<main>` para el contenido principal
  - `<h1>` para el titulo del juego (solo uno por pagina)
  - `<form>` para el bloque de unirse a partida
  - `<button>` para acciones (no `<div>` ni `<a>` con onclick)
- Asegurar que la pagina es indexable por motores de busqueda (no bloquear con robots.txt ni noindex)

## SEO-06: Rendimiento y Core Web Vitals

- La pagina de inicio debe cargar rapido al ser la puerta de entrada:
  - LCP (Largest Contentful Paint) < 2.5s
  - CLS (Cumulative Layout Shift) < 0.1
  - FID (First Input Delay) < 100ms
- Minimizar JS y CSS necesarios para la pantalla de inicio
- Las fuentes deben cargarse con `font-display: swap`
- Las imagenes decorativas deben estar optimizadas (WebP, comprimidas)

## MKT-01: Copywriting de la pantalla de inicio

- Titulo principal: "El Molino"
- Subtitulo: proponer 2-3 opciones que comuniquen la propuesta de valor:
  - "El clasico juego de estrategia, ahora online"
  - "Reta a un amigo. Sin registro, sin esperas"
  - "Crea una partida y juega en segundos"
- Texto del boton principal: "Crear partida"
- Placeholder del campo de codigo: "Codigo de partida"
- Texto del boton secundario: "Unirse"
- Los textos deben ser directos, cortos y orientados a la accion

## MKT-02: Pagina preparada para analytics

- Preparar la estructura para integrar Google Analytics o similar (sin instalar aun)
- Definir los eventos clave a trackear en el futuro:
  - `page_view` en pantalla de inicio
  - `click_create_game` al pulsar "Crear partida"
  - `click_join_game` al pulsar "Unirse"
  - `join_error` cuando falla unirse (con tipo de error)
- Dejar documentados estos eventos para implementarlos cuando se integre analytics
