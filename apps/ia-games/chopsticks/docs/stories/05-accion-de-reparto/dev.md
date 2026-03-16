# Story 05 — Tareas de desarrollo

## DEV-01: Logica de reparto — Funcion pura `getValidSplits`

- Implementar funcion `getValidSplits(state, playerId)` que:
  - Calcula el total de dedos del jugador (suma de ambas manos)
  - Genera todas las combinaciones [a, b] donde a + b = total, 0 <= a <= 4, 0 <= b <= 4
  - Filtra las combinaciones que sean distintas al estado actual
  - Devuelve la lista de distribuciones validas
- La funcion es pura y desacoplada de la UI

**Tests:**
- Estado [3, 1] (total 4): opciones validas incluyen [2, 2], [1, 3], [4, 0], [0, 4] (excluye [3, 1])
- Estado [4, 0] (total 4): opciones validas incluyen [3, 1], [2, 2], [1, 3], [0, 4] (excluye [4, 0])
- Estado [2, 2] (total 4): opciones validas incluyen [3, 1], [1, 3], [4, 0], [0, 4] (excluye [2, 2])
- Estado [4, 1] (total 5): no hay opciones validas (5,0 y 0,5 superan 4; el resto no suma 5 con ambos <= 4... excepto [4,1] y [1,4] que son el mismo o distinto)
- Estado [1, 1] (total 2): opciones validas incluyen [2, 0], [0, 2] (excluye [1, 1])
- Estado [0, 0]: devuelve lista vacia (jugador eliminado, no deberia llamarse)

## DEV-02: Logica de reparto — Funcion pura `applySplit`

- Implementar funcion `applySplit(state, playerId, newDistribution)` que:
  - Valida que la distribucion es valida (esta en la lista de `getValidSplits`)
  - Actualiza las manos del jugador con la nueva distribucion
  - Cambia el turno al otro jugador
  - Devuelve el nuevo estado
- La funcion es pura: no muta el estado

**Tests:**
- Reparto basico: [3, 1] → [2, 2] actualiza correctamente
- Reparto con revival: [4, 0] → [2, 2] revive la mano muerta
- Reparto inverso: [1, 3] → [3, 1] intercambia valores
- El turno cambia al otro jugador tras el reparto
- Reparto invalido (no esta en la lista) lanza error o devuelve estado sin cambios

## DEV-03: Panel de opciones de reparto en UI

- Al pulsar "Repartir", se abre un panel con las opciones validas
- Cada opcion se muestra como boton con los valores [izquierda, derecha]
- Boton "Cancelar" para cerrar el panel sin consumir el turno
- Estilos alineados con Pencil (UX-01, UX-02)
- Opciones que reviven mano muerta se marcan visualmente (UX-04)

**Tests:**
- Al pulsar "Repartir" se abre el panel de opciones
- Se muestran solo las opciones validas
- Al pulsar "Cancelar" se cierra el panel sin ejecutar accion
- Las opciones que reviven mano se marcan visualmente

## DEV-04: Ejecucion del reparto desde la UI

- Al seleccionar una opcion del panel, se ejecuta el reparto
- Se llama a `applySplit` y se actualiza el estado
- Las manos del jugador se actualizan con los nuevos valores
- Si se revive una mano, pasa de estado muerto a vivo visualmente
- El panel se cierra automaticamente
- El turno cambia al otro jugador

**Tests:**
- Seleccionar opcion ejecuta el reparto y actualiza el estado
- El panel se cierra tras ejecutar
- El turno cambia al otro jugador
- Mano revivida se muestra como viva con su nuevo valor

## DEV-05: Estado del boton "Repartir"

- El boton "Repartir" se habilita o deshabilita segun `getValidSplits`
- Al inicio de cada turno, se recalcula si hay repartos validos
- Si no hay repartos validos, el boton se muestra deshabilitado (gris, opacidad)
- Estilos alineados con Pencil (UX-03)

**Tests:**
- Con estado [3, 1] el boton esta habilitado
- Con estado [4, 1] (total 5 sin repartos validos) el boton esta deshabilitado
- El boton deshabilitado no abre el panel al pulsarlo
- Al cambiar de turno, el estado del boton se recalcula
