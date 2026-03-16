# Story 08 — Tareas de QA

---

## QA-DEV-01: Verificar estados de interaccion de manos

- Estado normal: mano viva sin resaltado especial
- Estado hover/focus: resaltado sutil al pasar raton o foco teclado
- Estado seleccionada: borde destacado, escala o color distinto
- Estado objetivo valido: mano rival resaltada
- Estado eliminada: opaca, no interactiva, con numero 0
- Estado no interactiva: mano viva pero no es turno (sin hover)
- Verificar que las transiciones entre estados son suaves

## QA-DEV-02: Verificar transiciones animadas

- Cambio de valor numerico tiene transicion (no es instantaneo)
- Eliminacion de mano tiene transicion a estado muerto
- Revival de mano tiene transicion de muerto a vivo
- Cambio de turno tiene transicion de enfasis
- Las transiciones duran entre 200-400ms
- Las transiciones no bloquean la siguiente interaccion

## QA-DEV-03: Verificar prevencion de acciones invalidas

- Click en mano muerta: no ocurre nada
- Click en mano rival antes de seleccionar atacante: no ocurre nada
- Click en cualquier mano fuera de turno: no ocurre nada
- Click durante partida terminada: no ocurre nada
- Doble click rapido: solo ejecuta una accion
- Pulsaciones rapidas durante transicion: no rompen el estado
- No se muestran mensajes de error intrusivos

## QA-DEV-04: Verificar microinteraccion de ataque

- Al atacar, aparece "+N" sobre la mano objetivo
- N corresponde al valor de la mano atacante
- El indicador desaparece en 500-800ms
- La animacion es suave y no intrusiva

## QA-DEV-05: Verificar accesibilidad completa

- Navegacion completa por teclado: Tab recorre todos los elementos interactivos
- Enter/Space activa el elemento enfocado
- Focus visible en todos los elementos interactivos
- `aria-label` en todas las manos con valor y estado (ej: "Mano izquierda, 3 dedos, viva")
- `role="status"` en indicador de turno
- `role="dialog"` en overlays
- Verificar con lector de pantalla (VoiceOver en macOS)
- Contraste WCAG AA en todos los textos y elementos

## QA-DEV-06: Verificar rendimiento

- No hay errores en consola durante una partida completa (inicio → victoria → revancha)
- Las transiciones no causan jank (verificar con DevTools Performance)
- El juego es fluido en dispositivo movil (throttle CPU 4x en DevTools)
- No hay memory leaks tras multiples revanchas

---

## QA-UX-01: Verificar estados de interaccion

- Comparar con "Design - Hand Interaction States" en fichero `.pen`
- Cada estado se ve como el diseno
- Las diferencias entre estados son claras y coherentes

## QA-UX-02: Verificar transiciones

- Comparar con "Design - Transitions" en fichero `.pen`
- Las transiciones son suaves y rapidas
- No son abruptas ni demasiado lentas

## QA-UX-03: Verificar indicadores de accion no disponible

- Las acciones no disponibles se comunican visualmente sin mensajes de error
- El jugador entiende que no puede interactuar con elementos deshabilitados
- No se usa solo el color para indicar disponibilidad

## QA-UX-04: Verificar accesibilidad visual

- Comparar con "Design - Accessibility Check" en fichero `.pen`
- Cada estado usa multiples indicadores (no solo color)
- Los numeros son legibles en todos los estados
- El contraste es suficiente

## QA-UX-05: Verificar microinteraccion de ataque

- Comparar con "Design - Attack Microinteraction" en fichero `.pen`
- El indicador "+N" es informativo sin saturar la interfaz
- Desaparece rapidamente

---

## QA-SEO-01: Verificar Core Web Vitals

- CLS < 0.1 con las animaciones activas
- INP < 200ms en todas las interacciones
- Verificar con Lighthouse en modo produccion

## QA-MKT-01: Verificar eventos de analytics

- Evento `invalid_move_attempted` definido como stub

## QA-MKT-02: Verificar rendimiento en produccion

- Performance score >= 90 en Lighthouse
- Las animaciones no degradan la experiencia en movil
