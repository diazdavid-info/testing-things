# Story 05 — Tareas de QA

---

## QA-DEV-01: Verificar logica de `getValidSplits`

- Estado [3, 1]: devuelve [2,2], [1,3], [4,0], [0,4] (no incluye [3,1])
- Estado [4, 0]: devuelve [3,1], [2,2], [1,3], [0,4] (no incluye [4,0])
- Estado [2, 2]: devuelve [3,1], [1,3], [4,0], [0,4] (no incluye [2,2])
- Estado [4, 1] (total 5): devuelve lista vacia (no hay reparto valido con ambos <= 4 y distinto)
- Estado [1, 1] (total 2): devuelve [2,0], [0,2] (no incluye [1,1])
- Los tests unitarios pasan correctamente

## QA-DEV-02: Verificar logica de `applySplit`

- Reparto [3, 1] → [2, 2]: estado actualizado correctamente
- Reparto [4, 0] → [2, 2]: mano muerta revive con valor 2
- El turno cambia al otro jugador tras el reparto
- Reparto invalido no se aplica
- Los tests unitarios pasan correctamente

## QA-DEV-03: Verificar panel de opciones en UI

- Al pulsar "Repartir" se abre el panel con opciones
- Solo se muestran distribuciones validas
- Las opciones son botones grandes y tactiles
- Pulsar "Cancelar" cierra el panel sin ejecutar accion
- El turno no se consume al cancelar

## QA-DEV-04: Verificar ejecucion del reparto

- Seleccionar una opcion del panel ejecuta el reparto
- Las manos del jugador se actualizan con los nuevos valores
- Si se revive una mano, pasa de estado muerto a vivo
- El panel se cierra automaticamente
- El turno cambia al otro jugador

## QA-DEV-05: Verificar estado del boton "Repartir"

- Con repartos validos disponibles: boton habilitado
- Sin repartos validos (ej: [4, 1]): boton deshabilitado y gris
- Boton deshabilitado no responde al click
- Al cambiar de turno, el estado del boton se recalcula correctamente

## QA-DEV-06: Verificar caso de revivir mano

- Estado [4, 0] → seleccionar [2, 2] revive la mano derecha
- La mano que estaba muerta ahora se ve como viva con valor 2
- La mano revivida es interactiva en el turno siguiente (puede atacar y ser atacada)

## QA-DEV-07: Verificar caso sin reparto posible

- Estado [4, 1] (total 5): el boton "Repartir" esta deshabilitado
- No se puede abrir el panel de opciones
- El jugador solo puede atacar en este turno

## QA-DEV-08: Verificar pulsaciones rapidas

- Pulsar varias opciones del panel rapidamente solo ejecuta un reparto
- Pulsar "Repartir" y "Cancelar" rapidamente no produce estado inconsistente

---

## QA-UX-01: Verificar diseno del panel de reparto

- Comparar con "Game - Split Panel" en fichero `.pen`
- Las opciones se muestran como pares [izquierda, derecha]
- Las opciones que reviven mano tienen indicador visual especial
- El panel no tapa completamente el tablero

## QA-UX-02: Verificar variante movil del panel

- Comparar con "Game - Split Panel Mobile" en fichero `.pen`
- Las opciones son grandes y tactiles (>= 44x44px)
- El panel se ve como bottom sheet o similar
- "Cancelar" o swipe down funciona correctamente

## QA-UX-03: Verificar estados del boton "Repartir"

- Habilitado: color activo, interactivo
- Deshabilitado: gris, opaco, no interactivo
- El cambio entre estados es coherente con la logica

## QA-UX-04: Verificar resultado del reparto

- Comparar con "Game - Split Result" en fichero `.pen`
- Las manos actualizan valores con transicion visual
- La mano revivida pasa de muerta a viva con transicion clara

---

## QA-MKT-01: Verificar eventos de analytics

- Evento `move_split` definido como stub
- Evento `split_cancelled` definido como stub
- Evento `split_panel_opened` definido como stub

## QA-MKT-02: Verificar copywriting

- Titulo del panel y textos coinciden con MKT-02
- Tono amigable y comprensible
- No hay errores ortograficos
