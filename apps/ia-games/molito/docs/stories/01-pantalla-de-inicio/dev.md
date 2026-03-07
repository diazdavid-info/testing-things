# Story 01 — Tareas de desarrollo

## DEV-01: Setup del proyecto

- Inicializar el proyecto con **Astro** (ultima version estable)
- Configurar estructura de carpetas base: `src/`, `src/components/`, `src/pages/`, `src/layouts/`, `src/lib/`
- Configurar linter, formatter y TypeScript
- Instalar y configurar **Tailwind CSS** (ultima version estable) como integracion de Astro (`@astrojs/tailwind`)
- Crear script de desarrollo local (`dev`, `build`, `preview`)
- Instalar y configurar **Vitest** como framework de testing
- Instalar **@testing-library/dom** y **@testing-library/jest-dom** para tests de componentes
- Instalar **happy-dom** o **jsdom** como entorno DOM para Vitest
- Crear script `test` y `test:watch` en `package.json`
- Verificar que el proyecto arranca correctamente en local y que `vitest run` pasa sin errores

## DEV-02: Pagina de inicio — Ruta y layout

- Crear la ruta principal `src/pages/index.astro` que renderiza la pantalla de inicio
- Crear el layout base en `src/layouts/Layout.astro` (contenedor centrado, fondo, tipografia con clases Tailwind)
- La pagina se renderiza como estatica (SSG por defecto en Astro)

## DEV-03: Componente "Crear partida"

- Crear boton "Crear partida"
- Al pulsar, realizar una llamada `POST /api/games` (se implementara en Story 02, por ahora puede ser un stub/mock)
- Mientras se procesa, mostrar estado de carga en el boton (disabled + spinner o texto)
- Al recibir respuesta, redirigir a `/molino/{code}` (sala de espera)
- Si hay error de red, mostrar mensaje generico de error

**Tests:**
- Test: al hacer click en el boton se dispara la llamada fetch a `POST /api/games`
- Test: mientras se procesa, el boton esta deshabilitado
- Test: al recibir respuesta exitosa, se redirige a la URL correcta
- Test: al recibir error de red, se muestra mensaje de error

## DEV-04: Componente "Unirse a partida"

- Crear campo de texto para introducir codigo de partida
- Crear boton "Unirse" junto al campo
- Validacion en cliente: el campo no puede estar vacio al pulsar "Unirse"
- Al pulsar, realizar una llamada `POST /api/games/{code}/join` (stub/mock por ahora)
- Manejar respuestas del servidor:
  - 200 → redirigir a `/molino/{code}`
  - 404 → mostrar mensaje "Codigo no encontrado"
  - 409 → mostrar mensaje "Partida llena"
  - 410 → mostrar mensaje "Esta partida ya ha terminado"
- Los mensajes de error se muestran debajo del campo de texto y desaparecen al volver a escribir
- Permitir enviar el codigo pulsando Enter ademas del boton

**Tests:**
- Test: no se puede enviar con el campo vacio (boton "Unirse" no dispara fetch)
- Test: al enviar un codigo, se dispara la llamada fetch a `POST /api/games/{code}/join`
- Test: respuesta 200 → redirige a `/molino/{code}`
- Test: respuesta 404 → muestra "Codigo no encontrado"
- Test: respuesta 409 → muestra "Partida llena"
- Test: respuesta 410 → muestra "Esta partida ya ha terminado"
- Test: el mensaje de error desaparece al escribir en el campo
- Test: pulsar Enter en el campo de texto envia el formulario
- Test: mientras se procesa, el boton y el campo estan deshabilitados

## DEV-05: Stubs de API

- Habilitar SSR en Astro (`output: 'server'` o `hybrid`) para soportar API routes
- Crear endpoint stub `src/pages/api/games.ts` (`POST`) que devuelve un `{ id, code, playerId }` hardcodeado
- Crear endpoint stub `src/pages/api/games/[code]/join.ts` (`POST`) que devuelve 200 con estado de juego mock
- Estos stubs permiten desarrollar y probar la UI sin depender del backend real
- Documentar el contrato esperado de cada endpoint para que el backend los implemente en stories posteriores

**Tests:**
- Test: `POST /api/games` devuelve 200 con `{ id, code, playerId }`
- Test: `POST /api/games/{code}/join` devuelve 200 con estado de juego
- Test: los campos devueltos tienen los tipos esperados

## DEV-06: Responsive y accesibilidad basica

- Verificar que la pagina se ve correctamente en viewports de 320px a 1440px
- Los elementos interactivos deben ser accesibles por teclado (tab, enter)
- Los mensajes de error deben tener `role="alert"` para lectores de pantalla
- El campo de texto debe tener un `label` asociado (visible o `aria-label`)

**Tests:**
- Test: los elementos interactivos son alcanzables por teclado (tab order)
- Test: los mensajes de error tienen `role="alert"`
- Test: el campo de texto tiene un label accesible asociado
