# Story 03 — Tareas de desarrollo

## DEV-01: Logica de ataque — Funcion pura `applyAttack`

- Implementar funcion `applyAttack(state, sourceHand, targetHand)` que:
  - Recibe el estado actual, la mano atacante (jugador activo) y la mano objetivo (rival)
  - Suma el valor de la mano atacante al valor de la mano objetivo
  - Si el resultado es >= 5, la mano objetivo pasa a 0
  - Devuelve el nuevo estado con el turno cambiado
- La funcion es pura: no muta el estado, devuelve uno nuevo
- La logica esta desacoplada de la UI

**Tests:**
- Ataque basico: [2, 1] ataca mano de 1 → mano objetivo pasa a 3
- Ataque con eliminacion: [2, 1] ataca mano de 3 → resultado 5 → mano pasa a 0
- Ataque con eliminacion excedente: [4, 1] ataca mano de 2 → resultado 6 → mano pasa a 0
- El turno cambia al otro jugador tras el ataque
- La mano atacante no cambia de valor

## DEV-02: Validacion de ataque — Funcion `isValidAttack`

- Implementar funcion `isValidAttack(state, sourceHand, targetHand)` que valide:
  - La mano atacante pertenece al jugador activo
  - La mano atacante tiene valor > 0
  - La mano objetivo pertenece al rival
  - La mano objetivo tiene valor > 0
  - La partida no esta terminada
- Implementar funcion `getValidAttackTargets(state, sourceHand)` que devuelve las manos rivales atacables

**Tests:**
- Ataque valido con ambas manos vivas
- Ataque invalido: mano atacante muerta (valor 0)
- Ataque invalido: mano objetivo muerta (valor 0)
- Ataque invalido: atacar mano propia
- Ataque invalido: partida terminada
- `getValidAttackTargets` devuelve solo manos rivales vivas

## DEV-03: Seleccion de mano atacante en UI

- Al tocar una mano propia viva, se marca como seleccionada en el estado de la UI
- Estilos de seleccion alineados con Pencil (UX-01)
- Al tocar otra mano propia, la seleccion cambia
- Al tocar la misma mano, se deselecciona
- Solo se pueden seleccionar manos del jugador activo
- Solo se pueden seleccionar manos vivas (valor > 0)

**Tests:**
- Tocar mano propia viva la marca como seleccionada
- Tocar otra mano propia cambia la seleccion
- Tocar la misma mano deselecciona
- Manos muertas no son seleccionables
- Manos del rival no son seleccionables como atacante

## DEV-04: Seleccion de mano objetivo y ejecucion del ataque

- Con una mano propia seleccionada, al tocar una mano rival viva se ejecuta el ataque
- Se llama a `applyAttack` y se actualiza el estado
- Tras el ataque, se deselecciona la mano atacante
- Se aplica feedback visual del resultado (transicion de valor)
- Las manos rivales muertas no son seleccionables como objetivo
- Estilos de targeting alineados con Pencil (UX-02)

**Tests:**
- Tocar mano rival viva con atacante seleccionada ejecuta el ataque
- El estado se actualiza correctamente tras el ataque
- La seleccion se limpia tras ejecutar el ataque
- Tocar mano rival muerta no ejecuta nada
- El turno cambia al otro jugador tras el ataque

## DEV-05: Texto de guia contextual

- Mostrar texto de guia segun el paso del ataque:
  - Sin seleccion: "Selecciona una de tus manos"
  - Con seleccion: "Ahora toca una mano del rival"
- El texto desaparece tras ejecutar la accion
- Estilos alineados con Pencil (UX-04)

**Tests:**
- Se muestra el texto de guia correcto segun el paso
- El texto cambia al seleccionar una mano
- El texto desaparece tras ejecutar el ataque
