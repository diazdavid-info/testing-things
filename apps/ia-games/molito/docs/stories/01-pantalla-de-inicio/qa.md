# Story 01 — Tareas de QA

> **Referencia rapida:**
> - Proyecto: `apps/ia-games/molito/app/`
> - Tests automaticos: `pnpm test` (21 tests en 4 ficheros)
> - Build: `pnpm build`
> - Dev server: `pnpm dev`
> - Stubs de API: codigo `FULL`=409, `DONE`=410, `XXXX`=404, cualquier otro=200
> - Disenos Pencil: `molino.pen` (4 pantallas: Desktop, Error States, Loading States, Mobile)

---

## QA-DEV-01: Verificar setup del proyecto

- El proyecto arranca correctamente con `pnpm dev`
- El build de produccion `pnpm build` genera sin errores
- TypeScript compila sin errores
- `pnpm test` ejecuta 21 tests y todos pasan

## QA-DEV-02: Verificar ruta y layout

- Acceder a `/` carga la pantalla de inicio correctamente
- Acceder a una ruta inexistente (ej: `/xyz`) no rompe la aplicacion (404 o redirect)
- El layout se renderiza centrado vertical y horizontalmente
- Las fuentes Space Grotesk e Inter cargan correctamente

## QA-DEV-03: Verificar boton "Crear partida"

- Al pulsar "Crear partida" se realiza la llamada a la API
- Mientras se procesa, el boton se deshabilita y muestra "Creando..."
- No se puede pulsar dos veces seguidas (doble click)
- Al recibir respuesta correcta, redirige a `/molino/{code}`
- Si falla la red (simular offline/DevTools), se muestra mensaje de error generico
- El mensaje de error desaparece al reintentar

> Componente: `src/components/CreateGameButton.astro`
> Tests: `src/test/create-game.test.ts` (4 tests)

## QA-DEV-04: Verificar componente "Unirse a partida"

- No se puede pulsar "Unirse" con el campo vacio
- Al introducir un codigo valido y pulsar "Unirse", redirige correctamente
- Al pulsar Enter en el campo de texto, se envia el formulario
- Codigo `XXXX` → muestra "Codigo no encontrado"
- Codigo `FULL` → muestra "Partida llena"
- Codigo `DONE` → muestra "Esta partida ya ha terminado"
- El mensaje de error desaparece al volver a escribir en el campo
- El borde del input cambia a rojo en error
- Mientras se procesa, el boton y el campo se deshabilitan y muestra "Conectando..."
- No se puede enviar dos veces seguidas

> Componente: `src/components/JoinGameForm.astro`
> Tests: `src/test/join-game.test.ts` (9 tests)

## QA-DEV-05: Verificar stubs de API

- `POST /api/games` devuelve 200 con `{ id, code, playerId }` (code tiene 4 caracteres)
- `POST /api/games/ABCD/join` devuelve 200 con `{ id, code, playerId, status: "playing" }`
- `POST /api/games/FULL/join` devuelve 409
- `POST /api/games/DONE/join` devuelve 410
- `POST /api/games/XXXX/join` devuelve 404

> Ficheros: `src/pages/api/games/index.ts`, `src/pages/api/games/[code]/join.ts`
> Tests: `src/test/api-stubs.test.ts` (5 tests)

## QA-DEV-06: Verificar responsive y accesibilidad

- Probar en los siguientes viewports:
  - Movil: 320px, 375px, 414px
  - Tablet: 768px
  - Escritorio: 1024px, 1440px
- Todos los elementos visibles y usables en cada viewport
- Tablero decorativo solo visible en `lg:` (>=1024px)
- Navegacion completa por teclado: Tab entre "Crear partida", campo de texto y "Unirse"
- Enter activa el elemento enfocado
- Los mensajes de error son anunciados por lectores de pantalla (`role="alert"`)
- El campo tiene `<label for="game-code">` con clase `sr-only`
- Contraste de colores cumple WCAG AA (verificar accent-primary #C8702A sobre blanco)

> Tests: `src/test/accessibility.test.ts` (3 tests)

---

## QA-UX-01: Verificar diseno de pantalla de inicio

- Comparar la implementacion con la pantalla "Home - Desktop" en `molino.pen`
- La jerarquia visual es correcta: "Crear partida" destaca como accion principal (boton amber)
- "Unirse" es claramente secundario (boton oscuro, mas pequeno)
- El titulo "El Molino" usa Space Grotesk bold, 48px
- Subtitulo en Inter regular, 16px, color secundario
- Centrado vertical y horizontal correcto

## QA-UX-02: Verificar variante movil

- Comparar con pantalla "Home - Mobile" en `molino.pen`
- En movil, los elementos se apilan correctamente dentro de la card
- El boton "Crear partida" ocupa el ancho completo
- El input y boton "Unirse" se muestran en una fila en mobile (no apilados)
- Los targets tactiles son de 52px de alto (>44px minimo)
- No hay scroll horizontal
- No hay texto cortado ni elementos que se solapen

## QA-UX-03: Verificar estados de error

- Comparar con pantalla "Home - Error States" en `molino.pen`
- Los mensajes de error aparecen debajo del campo
- Color rojo (#DC3545) para texto de error
- El borde del input cambia a rojo en error
- Los mensajes son legibles en pantallas pequenas

## QA-UX-04: Verificar estados de carga

- Comparar con pantalla "Home - Loading States" en `molino.pen`
- "Crear partida" cambia a "Creando..." con opacidad reducida
- "Unirse" cambia a "Conectando..." con opacidad reducida
- El campo se deshabilita visualmente

## QA-UX-05: Verificar paleta de colores y tipografia

- Colores definidos en `src/styles/global.css` bajo `@theme`
- Verificar que los colores implementados coinciden:
  - Fondo: #FBF8F4, Superficie: #FFFFFF
  - Texto: #1A1A1A, Secundario: #6B6B6B, Muted: #A0A0A0
  - Accent: #C8702A, Error: #DC3545
  - Borde: #E5E0DA
- Tipografia: Space Grotesk para titulos/botones, Inter para cuerpo
- No hay colores hardcodeados fuera de la paleta

## QA-UX-06: Verificar elemento decorativo del tablero

- Dos SVGs del tablero del molino como fondo decorativo
- Solo visibles en pantallas >= 1024px (`hidden lg:block`)
- Opacidad muy baja (3-5%), no interfieren con contenido
- Correctamente posicionados (derecha-abajo, izquierda-arriba)

---

## QA-SEO-01: Verificar metadatos

- `<title>` = "El Molino — Juega al clasico juego de estrategia online"
- `<meta name="description">` contiene texto con propuesta de valor
- `<meta name="keywords">` presente
- `<html lang="es">` presente
- No hay `noindex` ni bloqueos

> Fichero: `src/layouts/Layout.astro`

## QA-SEO-02: Verificar Open Graph y Twitter Cards

- `og:title`, `og:description`, `og:type` presentes
- `twitter:card`, `twitter:title`, `twitter:description` presentes
- `og:image` y `twitter:image` pendientes (SEO-03 no completado)
- Validar compartiendo link en WhatsApp/Telegram cuando se despliegue

## QA-SEO-03: Verificar imagen de preview social — SKIP

- La imagen de preview social no ha sido creada aun (tarea pendiente)
- Saltar esta verificacion hasta que se complete SEO-03

## QA-SEO-04: Verificar favicon e iconos

- Favicon SVG carga en la pestana del navegador
- El favicon representa el tablero del molino en color amber (#C8702A)
- `apple-touch-icon.png` pendiente para futuras iteraciones

> Fichero: `public/favicon.svg`

## QA-SEO-05: Verificar estructura semantica

- Solo hay un `<h1>` en la pagina ("El Molino")
- Se usa `<main>` para el contenido principal
- El bloque de unirse usa `<form>`
- Los botones son `<button type="button">` y `<button type="submit">`
- Validar HTML con [W3C Validator](https://validator.w3.org/)

## QA-SEO-06: Verificar rendimiento

- Ejecutar Lighthouse en modo produccion
- LCP < 2.5s, CLS < 0.1, FID < 100ms
- Performance score >= 90
- Fuentes cargan con `display=swap` (verificar en Network tab)
- No hay imagenes pesadas (decoraciones son SVG inline)

## QA-MKT-01: Verificar copywriting

- Titulo: "El Molino"
- Subtitulo: "El clasico juego de estrategia, ahora online"
- Boton principal: "Crear partida"
- Placeholder: "Codigo de partida"
- Boton secundario: "Unirse"
- Separador: "o"
- No hay errores ortograficos ni gramaticales
- Textos legibles en movil

## QA-MKT-02: Verificar preparacion para analytics

- Eventos documentados en `src/lib/analytics-events.ts`
- Tipos: `page_view`, `click_create_game`, `click_join_game`, `join_error`, `game_created`, `game_joined`
- Funcion `trackEvent()` existe como stub (no-op)
- No hay scripts de analytics cargados (verificar en Network tab)
