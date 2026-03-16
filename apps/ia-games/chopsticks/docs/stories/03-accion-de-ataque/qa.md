# Story 03 — Tareas de QA

---

## QA-DEV-01: Verificar logica de ataque

- Ataque basico: mano de 2 ataca mano de 1 → mano objetivo pasa a 3
- Ataque con eliminacion: mano de 2 ataca mano de 3 → resultado 5 → mano pasa a 0
- Ataque con excedente: mano de 4 ataca mano de 2 → resultado 6 → mano pasa a 0
- La mano atacante no cambia de valor despues del ataque
- El turno cambia al otro jugador
- Los tests unitarios de `applyAttack` pasan correctamente

## QA-DEV-02: Verificar validacion de ataque

- No se puede atacar con una mano muerta (valor 0)
- No se puede atacar una mano muerta del rival
- No se puede atacar una mano propia
- No se puede atacar cuando la partida ha terminado
- No se puede atacar cuando no es tu turno
- Los tests unitarios de `isValidAttack` pasan correctamente

## QA-DEV-03: Verificar seleccion de mano atacante

- Tocar mano propia viva → se marca como seleccionada visualmente
- Tocar otra mano propia → la seleccion cambia
- Tocar la misma mano → se deselecciona
- Manos muertas propias no son seleccionables (no reaccionan al toque)
- Manos del rival no reaccionan al toque en este paso
- Al deseleccionar, el estado visual vuelve al normal

## QA-DEV-04: Verificar seleccion de objetivo y ejecucion

- Con mano propia seleccionada, tocar mano rival viva ejecuta el ataque
- El valor de la mano rival se actualiza correctamente en la UI
- Si el resultado es >= 5, la mano rival pasa a 0 y se ve como eliminada
- Tocar mano rival muerta no hace nada
- Tras ejecutar, la seleccion de mano propia se limpia
- El turno cambia visualmente al otro jugador

## QA-DEV-05: Verificar texto de guia

- Sin seleccion: se muestra "Selecciona una de tus manos" o similar
- Con seleccion: se muestra "Ahora toca una mano del rival" o similar
- Tras ejecutar el ataque: el texto desaparece o vuelve al estado inicial

## QA-DEV-06: Verificar casos borde del ataque

- Pulsaciones rapidas: pulsar dos manos rivales rapido no ejecuta dos ataques
- Pulsar mano propia durante la resolucion del ataque no tiene efecto
- Atacar la unica mano viva del rival cuando la otra esta muerta funciona correctamente
- Atacar con la unica mano viva propia cuando la otra esta muerta funciona correctamente

---

## QA-UX-01: Verificar diseno de seleccion de atacante

- Comparar con "Game - Attack: Source Selected" en fichero `.pen`
- La mano seleccionada se destaca claramente
- Las demas manos propias siguen viendose interactivas
- El cambio visual es inmediato al tocar

## QA-UX-02: Verificar diseno de targeting

- Comparar con "Game - Attack: Targeting" en fichero `.pen`
- Las manos rivales vivas se resaltan como objetivos validos
- Las manos rivales muertas se ven opacas e inactivas
- Queda claro que el siguiente paso es tocar una mano rival

## QA-UX-03: Verificar diseno del resultado

- Comparar con "Game - Attack: Result" en fichero `.pen`
- La mano objetivo actualiza su valor con transicion visual
- Si se elimina, la transicion a estado muerto es clara

---

## QA-MKT-01: Verificar eventos de analytics

- Evento `move_attack` definido como stub
- Evento `invalid_move_attempted` definido como stub

## QA-MKT-02: Verificar textos de guia

- Textos de guia coinciden con lo definido en MKT-02
- Son legibles en movil y desktop
- No hay errores ortograficos
