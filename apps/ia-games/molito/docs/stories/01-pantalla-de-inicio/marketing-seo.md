# Story 01 — Tareas de marketing y SEO

## ~~SEO-01: Metadatos basicos de la pagina~~ DONE

- ~~`<title>`: "El Molino — Juega al clasico juego de estrategia online"~~
- ~~`<meta name="description">`: texto completo con propuesta de valor~~
- ~~`<meta name="keywords">`: molino, nine men's morris, etc.~~
- ~~`<html lang="es">`~~

> Implementado en `src/layouts/Layout.astro`

## ~~SEO-02: Open Graph y redes sociales~~ DONE (parcial)

- ~~`og:title`, `og:description`, `og:type` configurados~~
- ~~`twitter:card`, `twitter:title`, `twitter:description` configurados~~
- `og:image` y `twitter:image` pendientes de imagen de preview (SEO-03)
- `og:url` se configurara cuando haya dominio definitivo

> Implementado en `src/layouts/Layout.astro`

## SEO-03: Imagen de preview social — PENDIENTE

- Crear imagen de 1200x630px para preview en redes sociales
- Debe incluir: nombre del juego, tablero, llamada a la accion
- Esta tarea requiere diseño grafico dedicado o generacion con herramientas externas
- Una vez creada, referenciar en `og:image` y `twitter:image` del Layout

## ~~SEO-04: Favicon e iconos~~ DONE

- ~~Favicon SVG del tablero del molino en color accent (#C8702A)~~
- ~~Referenciado en `<link rel="icon">` del Layout~~
- `apple-touch-icon.png` y iconos PWA pendientes para futuras iteraciones

> Fichero: `public/favicon.svg`

## ~~SEO-05: Estructura semantica del HTML~~ DONE

- ~~`<main>` para contenido principal~~
- ~~`<h1>` unico para "El Molino"~~
- ~~`<form>` para el bloque de unirse~~
- ~~`<button>` para todas las acciones~~
- ~~Pagina indexable (sin noindex ni bloqueos)~~

> Implementado en `src/pages/index.astro`

## ~~SEO-06: Rendimiento y Core Web Vitals~~ DONE

- ~~Minimo JS: solo vanilla scripts en los componentes Astro~~
- ~~Sin framework JS de cliente (React, etc.)~~
- ~~Fuentes con `display=swap` via Google Fonts URL~~
- ~~Tablero decorativo es SVG inline, sin carga de imagen~~
- LCP, CLS y FID a verificar con Lighthouse en produccion

## ~~MKT-01: Copywriting de la pantalla de inicio~~ DONE

- ~~Titulo: "El Molino"~~
- ~~Subtitulo: "El clasico juego de estrategia, ahora online"~~
- ~~Boton principal: "Crear partida"~~
- ~~Placeholder: "Codigo de partida"~~
- ~~Boton secundario: "Unirse"~~
- ~~Separador: "o"~~

> Implementado en `src/pages/index.astro`

## ~~MKT-02: Pagina preparada para analytics~~ DONE

- ~~Eventos definidos y tipados en `src/lib/analytics-events.ts`:~~
  - ~~`page_view`, `click_create_game`, `click_join_game`, `join_error`, `game_created`, `game_joined`~~
- ~~Funcion `trackEvent()` como stub (no-op)~~
- ~~Ningun script de analytics cargado aun~~

> Fichero: `src/lib/analytics-events.ts`
