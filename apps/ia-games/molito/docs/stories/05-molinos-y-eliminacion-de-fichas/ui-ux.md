# Story 05 — Tareas de UI/UX (Pencil)

## ~~UX-00: Corregir diseno del tablero de Story 04~~ ✅

- El tablero disenado en Story 04 no muestra correctamente las lineas de conexion entre cuadrados
- Revisar y corregir:
  - Las 4 lineas que conectan los puntos medios de los 3 cuadrados concentricos deben ser visibles y bien alineadas
  - Las lineas de los cuadrados deben estar completas (no cortadas por las posiciones)
  - Verificar que las 24 posiciones estan exactamente en las intersecciones correctas
  - Las lineas deben tener grosor y color consistente (#3D3530, 2px)
- Corregir tanto la version desktop como la mobile
- Asegurar que el tablero se ve como el clasico del Molino: 3 cuadrados concentricos + 4 cruces

> Corregido: reemplazados los frames transparentes con lineas individuales (12 segmentos por tablero) en desktop y mobile.

## ~~UX-00b: Organizar y limpiar documento Pencil~~ ✅

- Revisar todos los frames del documento `molino.pen`:
  - Renombrar frames con nombres descriptivos y consistentes (ej: "S01 — Home Desktop", "S02 — Waiting Desktop", etc.)
  - Alinear frames en una cuadricula logica: stories en filas, variantes en columnas
  - Eliminar frames vacios, duplicados o que sobren
  - Verificar que cada frame tiene un nombre que identifique claramente su contenido
- Organizar por story:
  - Fila 1: Story 01 (Home)
  - Fila 2: Story 02 (Waiting Room)
  - Fila 3: Story 03 (Join)
  - Fila 4: Story 04 (Board/Game)
  - Fila 5: Story 05 (Mill/Remove)
- Asegurar padding consistente entre frames (100px)

> Todos los frames renombrados con prefijo SXX, alineados en grid por story, frame vacio `bi8Au` eliminado.

## ~~UX-01: Disenar estado de eliminacion de ficha — Desktop~~ ✅

- El tablero cambia de modo cuando `turnState === "remove"`:
  - Mensaje prominente encima o junto al tablero: "Molino! Elimina una ficha rival"
  - Las fichas rivales eliminables se resaltan: borde pulsante dorado/rojo, cursor pointer
  - Las fichas rivales en molino activo se muestran semitransparentes (no clicables)
  - Las fichas propias y posiciones vacias: aspecto normal, no clicables
- El fondo del tablero puede oscurecerse ligeramente para centrar la atencion en las fichas eliminables

> Frame `KOCuJ` "S05 — Remove State Desktop" con banner rojo, fichas eliminables con anillos dorados, fichas protegidas en gris.

## ~~UX-02: Disenar estado de eliminacion de ficha — Mobile~~ ✅

- Adaptar el diseno de eliminacion a mobile
- El mensaje "Molino! Elimina una ficha rival" debe ser visible sin scroll
- Las fichas eliminables deben ser lo suficientemente grandes para tap

> Frame `UJ5Jm` "S05 — Remove State Mobile" con banner rojo y badge "Eliminacion".

## ~~UX-03: Disenar feedback visual de molino formado~~ ✅

- Cuando se forma un molino, las 3 fichas se resaltan durante ~1.5s:
  - Opciones: borde dorado, glow, animacion de pulso
  - Las 3 fichas deben distinguirse claramente del resto
- El resaltado debe ser sutil pero claro — no puede confundirse con el estado de eliminacion

> Frame `8DdsV` "S05 — Mill Highlight Desktop" con glow dorado en las 3 fichas del molino.

## ~~UX-04: Disenar mensaje de "Turno del rival — eliminando ficha"~~ ✅

- Cuando es turno del rival y esta en modo eliminacion:
  - Mostrar indicador: "El rival esta eliminando una ficha..."
  - Las fichas propias que podrian ser eliminadas se pueden resaltar sutilmente (para que el jugador sepa cuales estan en riesgo)
  - El tablero no es interactivo en este estado

> Frame `EFQt8` "S05 — Rival Removing Desktop" con indicador gris "El rival esta eliminando una ficha...".
