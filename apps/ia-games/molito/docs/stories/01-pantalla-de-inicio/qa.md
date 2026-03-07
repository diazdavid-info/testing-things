# Story 01 — Tareas de QA

## QA-DEV-01: Verificar setup del proyecto

- El proyecto arranca correctamente con el script de desarrollo (`dev`)
- El build de produccion (`build`) genera sin errores
- El linter y formatter estan configurados y no reportan errores sobre el codigo entregado
- TypeScript compila sin errores

## QA-DEV-02: Verificar ruta y layout

- Acceder a `/` carga la pantalla de inicio correctamente
- Acceder a una ruta inexistente (ej: `/xyz`) no rompe la aplicacion (404 o redirect)
- El layout base se renderiza centrado y con la tipografia correcta

## QA-DEV-03: Verificar boton "Crear partida"

- Al pulsar "Crear partida" se realiza la llamada a la API
- Mientras se procesa, el boton se deshabilita y muestra estado de carga
- No se puede pulsar dos veces seguidas (doble click)
- Al recibir respuesta correcta, redirige a `/molino/{code}`
- Si falla la red (simular offline), se muestra mensaje de error generico
- El mensaje de error desaparece al reintentar

## QA-DEV-04: Verificar componente "Unirse a partida"

- No se puede pulsar "Unirse" con el campo vacio
- Al introducir un codigo valido y pulsar "Unirse", redirige correctamente
- Al pulsar Enter en el campo de texto, se envia el formulario (mismo efecto que pulsar "Unirse")
- Respuesta 404 → muestra "Codigo no encontrado"
- Respuesta 409 → muestra "Partida llena"
- Respuesta 410 → muestra "Esta partida ya ha terminado"
- El mensaje de error desaparece al volver a escribir en el campo
- Mientras se procesa, el boton y el campo se deshabilitan
- No se puede enviar dos veces seguidas (doble submit)

## QA-DEV-05: Verificar stubs de API

- `POST /api/games` devuelve 200 con `{ id, code, playerId }`
- `POST /api/games/{code}/join` devuelve 200 con estado de juego mock
- Los stubs responden con los tipos y estructura documentados

## QA-DEV-06: Verificar responsive y accesibilidad

- Probar en los siguientes viewports:
  - Movil: 320px, 375px, 414px
  - Tablet: 768px
  - Escritorio: 1024px, 1440px
- Todos los elementos visibles y usables en cada viewport
- Navegacion completa por teclado: Tab entre boton "Crear partida", campo de texto y boton "Unirse"
- Enter activa el elemento enfocado
- Los mensajes de error son anunciados por lectores de pantalla (`role="alert"`)
- El campo de texto tiene label asociado (visible o `aria-label`)
- Contraste de colores cumple WCAG AA (ratio minimo 4.5:1 para texto)

---

## QA-UX-01: Verificar diseno de pantalla de inicio

- El diseno implementado coincide con el mockup de Pencil
- La jerarquia visual es correcta: "Crear partida" destaca como accion principal
- El bloque de "Unirse" es claramente secundario pero accesible
- El titulo "El Molino" es legible y tiene el peso visual esperado
- El subtitulo se lee bien y no compite con el titulo
- El centrado vertical y horizontal es correcto

## QA-UX-02: Verificar variante movil

- En movil, los elementos se apilan correctamente
- El boton "Crear partida" ocupa el ancho completo
- El campo + boton "Unirse" se muestran correctamente (fila o apilados)
- Los targets tactiles tienen al menos 44x44px
- No hay scroll horizontal en ningun viewport movil
- No hay texto cortado ni elementos que se solapen

## QA-UX-03: Verificar estados de error

- Los mensajes de error aparecen debajo del campo sin desplazar otros elementos
- El color y estilo del error coinciden con el diseno (rojo suave, icono si aplica)
- Los mensajes son legibles y no se cortan en pantallas pequenas

## QA-UX-04: Verificar estados de carga

- El boton "Crear partida" muestra estado de carga al pulsar
- El boton "Unirse" muestra estado de carga al pulsar
- El campo de texto se deshabilita durante la carga
- Los estados de carga coinciden con el diseno de Pencil

## QA-UX-05: Verificar paleta de colores y tipografia

- Los colores implementados coinciden con la paleta definida en el diseno
- La tipografia (familia, tamanos, pesos) coincide con lo definido
- El espaciado (padding, gap, margenes) es consistente con el diseno
- No hay colores hardcodeados que no pertenezcan a la paleta

## QA-UX-06: Verificar elemento decorativo del tablero

- La ilustracion o grafico del tablero se muestra correctamente
- No interfiere con los elementos de accion (botones, campo)
- Se adapta bien a diferentes tamanos de pantalla
- Tiene opacidad o tono adecuado para no competir con el contenido principal

---

## QA-SEO-01: Verificar metadatos

- `<title>` contiene el texto definido
- `<meta name="description">` contiene el texto definido
- `<html lang="es">` esta presente
- No hay etiquetas `noindex` ni bloqueos en `robots.txt`

## QA-SEO-02: Verificar Open Graph y Twitter Cards

- Etiquetas `og:title`, `og:description`, `og:image`, `og:type`, `og:url` presentes y correctas
- Etiquetas `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` presentes
- Validar con herramientas:
  - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
  - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- Al compartir el link en WhatsApp/Telegram/Slack se muestra preview correcto

## QA-SEO-03: Verificar imagen de preview social

- La imagen existe y carga correctamente
- Tamano 1200x630px
- Peso optimizado (< 300KB)
- Se muestra correctamente en previews sociales

## QA-SEO-04: Verificar favicon e iconos

- `favicon.ico` carga en el navegador (pestana)
- `apple-touch-icon.png` esta configurado
- Iconos de 192px y 512px presentes si se definieron
- Los iconos se ven nitidos y representan el juego

## QA-SEO-05: Verificar estructura semantica

- Solo hay un `<h1>` en la pagina
- Se usa `<main>` para el contenido principal
- El bloque de unirse usa `<form>`
- Los botones son `<button>`, no `<div>` ni `<a>`
- Validar HTML con [W3C Validator](https://validator.w3.org/)

## QA-SEO-06: Verificar rendimiento

- Ejecutar Lighthouse en modo produccion
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms
- Performance score >= 90
- Las fuentes cargan con `font-display: swap`
- Las imagenes estan en formato optimizado (WebP o comprimido)

## QA-MKT-01: Verificar copywriting

- El titulo, subtitulo, textos de botones y placeholder coinciden con lo definido en MKT-01
- No hay errores ortograficos ni gramaticales
- Los textos se leen bien en movil (no se cortan, no son demasiado largos)

## QA-MKT-02: Verificar preparacion para analytics

- Los eventos definidos en MKT-02 estan documentados
- La estructura para integrar analytics esta preparada (ej: data attributes o funciones stub)
- No se esta enviando nada a terceros aun (no hay scripts de analytics cargados)
