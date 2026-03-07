# Story 05 — Tareas de QA

## QA-01: Formacion de molinos

- [ ] Al colocar la tercera ficha en una linea valida, se detecta como molino
- [ ] Las 3 fichas del molino se resaltan visualmente durante ~1.5s
- [ ] El mensaje "Molino! Elimina una ficha rival" aparece claramente
- [ ] El turno NO cambia automaticamente — se espera la eliminacion

## QA-02: Eliminacion de ficha rival

- [ ] Tras formar molino, se pueden ver las fichas eliminables del rival (resaltadas)
- [ ] Click en ficha rival eliminable: se elimina del tablero
- [ ] El contador de fichas en tablero del rival disminuye
- [ ] El turno pasa al otro jugador tras eliminar

## QA-03: Reglas de proteccion de molinos

- [ ] No se puede eliminar una ficha rival que esta en un molino activo
- [ ] Al intentar eliminar ficha en molino: mensaje de error "No puedes eliminar una ficha que esta en un molino"
- [ ] Si TODAS las fichas del rival estan en molinos: se puede eliminar cualquiera
- [ ] No se puede seleccionar posicion vacia ni ficha propia

## QA-04: Fin de partida por eliminacion

- [ ] Si tras eliminar, el rival queda con menos de 3 fichas (sin fichas por colocar), la partida termina
- [ ] Se muestra al ganador correctamente
- [ ] El tablero queda en estado no interactivo

## QA-05: Estado del rival durante eliminacion

- [ ] Cuando el rival forma un molino, el jugador ve "El rival esta eliminando una ficha..."
- [ ] El tablero no es interactivo mientras el rival elimina
- [ ] Cuando el rival elimina, el estado se actualiza y el turno cambia

## QA-06: Diseno del tablero (correccion Story 04)

- [ ] Las 3 cuadrados concentricos se ven completos con lineas bien definidas
- [ ] Las 4 lineas de conexion entre cuadrados son visibles
- [ ] Las 24 posiciones estan exactamente en las intersecciones
- [ ] Verificar en desktop y mobile

## QA-07: Organizacion de Pencil

- [ ] Todos los frames en el documento Pencil tienen nombres descriptivos
- [ ] Los frames estan organizados en filas por story
- [ ] No hay frames vacios o duplicados
- [ ] Alineacion y padding consistentes

## QA-08: Accesibilidad

- [ ] Las fichas eliminables son accesibles con teclado
- [ ] El mensaje de molino tiene `role="alert"` para lectores de pantalla
- [ ] Aria-labels actualizados para fichas eliminables ("Ficha Jugador 2, eliminable")
- [ ] Los mensajes de error se anuncian via aria-live

## QA-09: Responsive

- [ ] Estado de eliminacion funciona correctamente en mobile
- [ ] El mensaje "Molino!" es visible sin scroll en mobile
- [ ] Las fichas eliminables son lo suficientemente grandes para tap
