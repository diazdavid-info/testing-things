# Story 10 — Tareas de QA

## QA-01: Tests de tracking de conexion

- Test: `lastSeen` se actualiza al conectar al SSE
- Test: `isPlayerDisconnected` retorna true despues de grace period
- Test: `isPlayerDisconnected` retorna false si recien conectado

## QA-02: Tests de claim-victory

- Test: claim exitoso cuando rival lleva 5+ minutos desconectado
- Test: claim rechazado cuando rival esta conectado
- Test: claim rechazado cuando no es tu turno (jugador invalido)
- Test: winReason es "abandon"

## QA-03: Tests de integracion

- Test: banner de desconexion aparece despues de 15s
- Test: banner desaparece al reconectar rival
- Test: boton "Reclamar victoria" aparece despues de 5 minutos
