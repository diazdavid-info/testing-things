# Story 11 — Tareas de QA

## QA-01: Tests de revancha

- Test: primer jugador solicita revancha → waiting: true
- Test: ambos solicitan → nueva partida creada con rematchCode
- Test: nueva partida tiene tablero limpio y perdedor tiene primer turno
- Test: rechazado si partida no esta terminada
- Test: rechazado si jugador no pertenece a partida

## QA-02: Tests de integracion

- Test: boton "Revancha" envia POST correcto
- Test: redirect automatico cuando rival acepta
- Test: estado "Esperando rival..." visible
