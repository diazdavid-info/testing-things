# Story 01 — Tareas de QA

---

## QA-DEV-01: Verificar setup del proyecto

- El proyecto arranca correctamente con el comando de desarrollo
- El build de produccion genera sin errores
- TypeScript compila sin errores
- Los tests pasan correctamente

## QA-DEV-02: Verificar ruta y layout

- Acceder a `/` carga la pantalla de inicio correctamente
- Acceder a una ruta inexistente no rompe la aplicacion
- El layout se renderiza centrado vertical y horizontalmente
- Las fuentes cargan correctamente

## QA-DEV-03: Verificar boton "Nueva partida"

- Al pulsar "Nueva partida" se navega a la pantalla de juego
- El boton es accesible por teclado (Tab + Enter)
- No se puede pulsar dos veces seguidas antes de navegar

## QA-DEV-04: Verificar boton "Como jugar"

- Al pulsar "Como jugar" se navega a la pantalla de tutorial
- El boton es accesible por teclado
- El boton es visualmente secundario respecto a "Nueva partida"

## QA-DEV-05: Verificar responsive

- Probar en los siguientes viewports:
  - Movil: 320px, 375px, 414px
  - Tablet: 768px
  - Escritorio: 1024px, 1440px
- Todos los elementos visibles y usables en cada viewport
- No hay scroll horizontal
- No hay texto cortado ni elementos solapados
- Botones con target tactil >= 44px

---

## QA-UX-01: Verificar diseno de pantalla de inicio

- Comparar la implementacion con la pantalla "Home - Desktop" en el fichero `.pen`
- La jerarquia visual es correcta: "Nueva partida" destaca como accion principal
- "Como jugar" es claramente secundario
- Titulo usa la tipografia y tamano definidos en Pencil
- Centrado vertical y horizontal correcto
- Elemento decorativo se muestra correctamente

## QA-UX-02: Verificar variante movil

- Comparar con pantalla "Home - Mobile" en el fichero `.pen`
- En movil, los elementos se apilan correctamente
- Botones ocupan el ancho completo
- Targets tactiles >= 52px de alto
- No hay scroll horizontal ni elementos cortados

## QA-UX-03: Verificar paleta de colores y tipografia

- Los colores implementados coinciden con los definidos en Pencil (UX-03)
- Tipografia correcta en titulos y cuerpo
- No hay colores hardcodeados fuera de la paleta
- Contraste de colores cumple WCAG AA

---

## QA-SEO-01: Verificar metadatos

- `<title>` contiene el nombre del juego
- `<meta name="description">` presente con texto descriptivo
- `<html lang="es">` presente
- No hay `noindex` ni bloqueos

## QA-SEO-02: Verificar Open Graph

- `og:title`, `og:description`, `og:type` presentes
- `twitter:card`, `twitter:title`, `twitter:description` presentes

## QA-SEO-03: Verificar favicon

- Favicon SVG carga en la pestana del navegador
- Representa la identidad del juego

## QA-SEO-04: Verificar estructura semantica

- Solo hay un `<h1>` en la pagina
- Se usa `<main>` para el contenido principal
- Los botones son `<button>`
- Validar HTML con W3C Validator

## QA-SEO-05: Verificar rendimiento

- Ejecutar Lighthouse en modo produccion
- Performance score >= 90
- Fuentes cargan con `display=swap`

## QA-MKT-01: Verificar copywriting

- Titulo, subtitulo y textos de botones coinciden con lo definido en MKT-01
- No hay errores ortograficos ni gramaticales
- Textos legibles en movil

## QA-MKT-02: Verificar preparacion para analytics

- Eventos definidos y tipados
- Funcion `trackEvent()` existe como stub
- No hay scripts de analytics cargados
