# Story 03 — Tareas de QA

## QA-01: Flujo de union por link directo

- [ ] Crear partida desde la pantalla de inicio
- [ ] Copiar el link y abrirlo en otra pestana/navegador
- [ ] Verificar que aparece brevemente "Uniendose a la partida..."
- [ ] Verificar que tras el join, el jugador 2 ve el tablero (placeholder)
- [ ] Verificar que el jugador 1 (en la sala de espera) transiciona automaticamente al tablero

## QA-02: Flujo de union por formulario

- [ ] Crear partida y copiar el codigo
- [ ] En otra pestana, ir a la pantalla de inicio e introducir el codigo
- [ ] Verificar que redirige a `/molino/{code}` y muestra el tablero
- [ ] Verificar que el jugador 1 transiciona al tablero

## QA-03: Validaciones de error

- [ ] Introducir un codigo inexistente en el formulario → "Codigo no encontrado"
- [ ] Intentar unirse a una partida que ya tiene 2 jugadores → "Partida llena"
- [ ] Intentar unirse a una partida terminada → "Esta partida ya ha terminado"
- [ ] Abrir link de partida llena → pantalla de error "Partida llena"
- [ ] Abrir link de partida terminada → pantalla de error "Partida terminada"

## QA-04: Identidad de jugadores

- [ ] Player1 accede a su propia URL: ve sala de espera (no auto-join)
- [ ] Player2 recarga la pagina tras unirse: sigue viendo el tablero (no re-join)
- [ ] Un tercer jugador intenta acceder: ve "Partida llena"
- [ ] Player1 no puede unirse via formulario a su propia partida

## QA-05: Casos limite

- [ ] Dos jugadores intentan unirse al mismo tiempo (race condition): solo uno tiene exito
- [ ] Codigo en minusculas se normaliza a mayusculas
- [ ] Codigo con espacios se recorta (trim)
- [ ] La cookie de jugador se mantiene tras recargar la pagina
- [ ] Probar en Chrome, Safari y Firefox

## QA-06: Accesibilidad

- [ ] Los mensajes de error tienen `role="alert"` para lectores de pantalla
- [ ] El estado de carga "Uniendose a la partida..." es anunciado
- [ ] Navegacion con teclado funcional en todo el flujo
- [ ] El foco se mueve correctamente tras errores

## QA-07: Responsive

- [ ] Verificar flujo completo en mobile (375px)
- [ ] Verificar flujo completo en tablet (768px)
- [ ] Verificar flujo completo en desktop (1440px)
- [ ] Los mensajes de error no desbordan en pantallas pequenas
