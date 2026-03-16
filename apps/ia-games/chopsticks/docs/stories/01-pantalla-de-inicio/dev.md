# Story 01 — Tareas de desarrollo

## DEV-01: Setup del proyecto

- Inicializar el proyecto con **Astro** (ultima version) + **React** + **Tailwind CSS**
- Configurar estructura de carpetas: `src/components/`, `src/pages/`, `src/layouts/`, `src/lib/`, `src/styles/`, `src/test/`
- TypeScript configurado en modo strict
- Tailwind CSS configurado via `@tailwindcss/vite`
- `@astrojs/react` como integracion para componentes interactivos
- Scripts: `dev`, `build`, `preview`, `test`, `test:watch`
- Vitest + `@testing-library/dom` + `@testing-library/jest-dom` + `happy-dom`
- Build y tests pasan sin errores

**Tests:**
- El proyecto compila sin errores
- El servidor de desarrollo arranca correctamente

## DEV-02: Pagina de inicio — Ruta y layout

- Crear la pagina principal en la ruta raiz (`/`)
- Layout base con contenedor centrado, fondo, tipografia y metadatos basicos
- Aplicar los estilos definidos en el diseno de Pencil (UX-03)

**Tests:**
- La ruta `/` renderiza correctamente
- El layout contiene los elementos esperados (titulo, botones)

## DEV-03: Componente "Nueva partida"

- Boton "Nueva partida" como accion principal
- Al pulsar, inicia una partida local y navega a la pantalla de juego
- Estilos alineados con el diseno de Pencil (UX-01, UX-02)

**Tests:**
- El boton se renderiza con el texto correcto
- Al pulsar, se navega a la pantalla de juego
- El boton es accesible por teclado

## DEV-04: Componente "Como jugar"

- Boton secundario "Como jugar"
- Al pulsar, navega a la pantalla de tutorial (ver Story 07)
- Estilos secundarios alineados con el diseno de Pencil

**Tests:**
- El boton se renderiza con el texto correcto
- Al pulsar, se navega a la pantalla de tutorial

## DEV-05: Responsive y accesibilidad basica

- Responsive: layout adaptativo segun disenos de Pencil (UX-01 desktop, UX-02 movil)
- Botones con targets tactiles de al menos 44x44px
- Estructura semantica: `<main>`, `<h1>` unico, `<button>` para acciones
- Navegacion completa por teclado (Tab entre botones)

**Tests:**
- Elementos interactivos alcanzables por teclado
- Solo un `<h1>` en la pagina
- Estructura semantica correcta (`<main>`, `<button>`)
