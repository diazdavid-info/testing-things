# Story 06 — Tareas de QA

## QA-01: Transicion a fase de movimiento

- [ ] Al colocar la ultima ficha (ambos jugadores con 0 por colocar), la fase cambia a "Movimiento"
- [ ] El badge de fase muestra "Movimiento"
- [ ] Las posiciones vacias ya no son clicables directamente (no se colocan fichas)

## QA-02: Seleccion de ficha

- [ ] En fase movimiento, las fichas propias son clicables
- [ ] Al hacer click en una ficha propia, se resalta visualmente
- [ ] Las posiciones adyacentes vacias se resaltan como destinos
- [ ] Al hacer click en otra ficha propia, cambia la seleccion
- [ ] Al hacer click en la ficha seleccionada, se deselecciona
- [ ] Las fichas del rival no son clicables/seleccionables

## QA-03: Movimiento de ficha

- [ ] Al seleccionar destino valido, la ficha se mueve correctamente
- [ ] La posicion origen queda vacia
- [ ] La posicion destino tiene la ficha del jugador
- [ ] El turno pasa al rival tras mover
- [ ] No se puede mover a posicion no adyacente
- [ ] No se puede mover a posicion ocupada

## QA-04: Molino tras movimiento

- [ ] Si el movimiento forma un molino, se activa el estado de eliminacion (Story 05)
- [ ] El turno NO cambia — se espera la eliminacion
- [ ] El flujo de eliminacion funciona igual que en fase de colocacion

## QA-05: Fin de partida por bloqueo

- [ ] Si tras mover, el rival no tiene movimientos validos, la partida termina
- [ ] Se muestra al ganador correctamente
- [ ] El tablero queda en estado no interactivo

## QA-06: Estado del rival durante movimiento

- [ ] Cuando es turno del rival, se muestra "Turno del rival"
- [ ] El tablero no es interactivo mientras el rival mueve
- [ ] Cuando el rival mueve, el estado se actualiza correctamente

## QA-07: Accesibilidad

- [ ] Las fichas seleccionables son accesibles con teclado (Tab + Enter)
- [ ] Los destinos validos son accesibles con teclado tras seleccionar ficha
- [ ] Aria-labels actualizados: "Ficha Jugador 1, seleccionable", "Posicion X, destino valido"
- [ ] Los cambios de estado se anuncian via aria-live

## QA-08: Responsive

- [ ] La seleccion de ficha funciona correctamente en mobile
- [ ] Los destinos validos son lo suficientemente grandes para tap
- [ ] El flujo de dos pasos (seleccionar + destino) es intuitivo en pantallas tactiles
