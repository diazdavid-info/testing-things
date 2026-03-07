# Story 01 — Tareas de desarrollo

## ~~DEV-01: Setup del proyecto~~ DONE

- ~~Inicializar el proyecto con **Astro v5.18.0**~~
- ~~Configurar estructura de carpetas: `src/components/`, `src/pages/`, `src/layouts/`, `src/lib/`, `src/styles/`, `src/test/`~~
- ~~TypeScript configurado (strict via template minimal)~~
- ~~**Tailwind CSS v4** via `@tailwindcss/vite` (Tailwind v4 no usa `@astrojs/tailwind`)~~
- ~~Scripts: `dev`, `build`, `preview`, `test`, `test:watch`~~
- ~~**Vitest v4** + `@testing-library/dom` + `@testing-library/jest-dom` + `happy-dom`~~
- ~~**@astrojs/node** como adapter SSR para API routes~~
- ~~Build y tests pasan sin errores (21 tests)~~

> Ficheros: `astro.config.mjs`, `vitest.config.ts`, `src/test/setup.ts`, `src/styles/global.css`

## ~~DEV-02: Pagina de inicio — Ruta y layout~~ DONE

- ~~`src/pages/index.astro` renderiza la pantalla de inicio~~
- ~~`src/layouts/Layout.astro` con contenedor centrado, fondo, tipografia, metadatos SEO~~
- ~~La pagina usa SSR (necesario para API routes)~~

## ~~DEV-03: Componente "Crear partida"~~ DONE

- ~~`src/components/CreateGameButton.astro`~~
- ~~Llama a `POST /api/games` al pulsar~~
- ~~Estado de carga: texto "Creando...", boton disabled~~
- ~~Redirige a `/molino/{code}` en exito~~
- ~~Muestra error generico en fallo de red~~

**Tests (4/4):** `src/test/create-game.test.ts`
- ~~fetch a POST /api/games~~
- ~~boton disabled durante procesamiento~~
- ~~redirect correcto en exito~~
- ~~mensaje de error en fallo de red~~

## ~~DEV-04: Componente "Unirse a partida"~~ DONE

- ~~`src/components/JoinGameForm.astro`~~
- ~~Campo de texto + boton "Unirse" en `<form>`~~
- ~~Validacion: no envia si campo vacio~~
- ~~Maneja 200, 404, 409, 410 con mensajes correspondientes~~
- ~~Errores desaparecen al escribir, Enter envia formulario~~

**Tests (9/9):** `src/test/join-game.test.ts`
- ~~campo vacio no dispara fetch~~
- ~~fetch a POST /api/games/{code}/join~~
- ~~redirect en 200~~
- ~~"Codigo no encontrado" en 404~~
- ~~"Partida llena" en 409~~
- ~~"Esta partida ya ha terminado" en 410~~
- ~~error desaparece al escribir~~
- ~~Enter envia formulario~~
- ~~boton e input disabled durante procesamiento~~

## ~~DEV-05: Stubs de API~~ DONE

- ~~SSR habilitado con `output: 'server'` + `@astrojs/node`~~
- ~~`src/pages/api/games/index.ts` — genera id, code (4 chars), playerId~~
- ~~`src/pages/api/games/[code]/join.ts` — simula respuestas segun codigo (FULL=409, DONE=410, XXXX=404, resto=200)~~

**Tests (5/5):** `src/test/api-stubs.test.ts`
- ~~POST /api/games devuelve 200 con id, code, playerId~~
- ~~POST /api/games/ABCD/join devuelve 200~~
- ~~POST /api/games/FULL/join devuelve 409~~
- ~~POST /api/games/DONE/join devuelve 410~~
- ~~POST /api/games/XXXX/join devuelve 404~~

## ~~DEV-06: Responsive y accesibilidad basica~~ DONE

- ~~Responsive: card con `max-w-lg`, padding adaptativo, tablero decorativo solo en `lg:`~~
- ~~Movil: input y boton apilados verticalmente a full width~~
- ~~`role="alert"` en mensajes de error~~
- ~~`<label for="game-code">` con `sr-only`~~

**Tests (3/3):** `src/test/accessibility.test.ts`
- ~~elementos interactivos alcanzables por teclado~~
- ~~mensajes de error con role=alert~~
- ~~input con label accesible~~
