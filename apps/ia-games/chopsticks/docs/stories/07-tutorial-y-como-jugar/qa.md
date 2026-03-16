# Story 07 — Tareas de QA

---

## QA-DEV-01: Verificar pagina de tutorial

- La ruta del tutorial carga correctamente
- Se muestran todas las secciones: objetivo, estado inicial, ataque, reparto, victoria
- El boton "Volver" navega a la pantalla de inicio
- La pagina es scrollable si el contenido lo requiere
- Los tests pasan correctamente

## QA-DEV-02: Verificar ejemplo visual de ataque

- El ejemplo muestra el estado antes y despues del ataque
- Los valores son correctos (ej: 2 + 3 = 5 → eliminada)
- Las manos se representan visualmente de forma coherente con el juego

## QA-DEV-03: Verificar ejemplo visual de reparto

- El ejemplo muestra [4, 0] → [2, 2]
- La mano muerta se ve como eliminada antes del reparto
- La mano revivida se ve como viva despues del reparto
- La transicion muerte → vida es visualmente clara

## QA-DEV-04: Verificar overlay de ayuda desde el tablero

- El boton de ayuda (?) es visible en la pantalla de juego
- Al pulsar, se abre el overlay con reglas resumidas
- Al cerrar, la partida continua en su estado anterior
- El estado del juego no cambia al abrir/cerrar la ayuda
- El overlay es accesible por teclado

## QA-DEV-05: Verificar navegacion

- Inicio → tutorial → inicio: la navegacion funciona correctamente
- Tablero → ayuda → cerrar: el estado de la partida se mantiene
- No hay estados residuales ni errores de navegacion

## QA-DEV-06: Verificar responsive del tutorial

- Probar en viewports: 320px, 375px, 414px, 768px, 1024px, 1440px
- El contenido es legible y las ilustraciones se adaptan
- No hay scroll horizontal
- El boton "Volver" es accesible en todos los viewports

---

## QA-UX-01: Verificar diseno del tutorial desktop

- Comparar con "Tutorial - Desktop" en fichero `.pen`
- La estructura del contenido sigue el orden definido
- Las ilustraciones de ejemplos son claras
- El estilo visual es coherente con el resto del juego

## QA-UX-02: Verificar diseno del tutorial movil

- Comparar con "Tutorial - Mobile" en fichero `.pen`
- El contenido se adapta al ancho de pantalla
- Las ilustraciones son legibles
- El boton "Volver" es accesible

## QA-UX-03: Verificar ejemplo de ataque

- La ilustracion se entiende sin leer texto adicional
- Los colores y flechas guian la comprension
- Los numeros son correctos y legibles

## QA-UX-04: Verificar ejemplo de reparto

- La ilustracion muestra claramente la mano muerta y la mano revivida
- Se entiende que el reparto redistribuye los dedos
- Los colores diferencian mano muerta de mano viva

## QA-UX-05: Verificar overlay de ayuda

- Comparar con "Game - Help Overlay" en fichero `.pen`
- El contenido es mas breve que el tutorial completo
- El overlay no tapa completamente el tablero o tiene boton de cierre claro

---

## QA-SEO-01: Verificar metadatos del tutorial

- `<title>` contiene "Como jugar" y el nombre del juego
- `<meta name="description">` presente con descripcion de reglas

## QA-SEO-02: Verificar estructura semantica

- `<h1>` para titulo del tutorial
- `<h2>` para cada seccion
- Ilustraciones con `alt` descriptivo

## QA-MKT-01: Verificar copywriting

- Textos coinciden con lo definido en MKT-01
- Tono amigable y comprensible para ninos
- No hay errores ortograficos
- Los ejemplos usan numeros concretos

## QA-MKT-02: Verificar eventos de analytics

- Eventos `tutorial_opened`, `tutorial_closed`, `help_overlay_opened`, `help_overlay_closed` definidos como stubs
