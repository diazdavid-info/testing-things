# Story 09 — Tareas de QA

## QA-01: Tests de game-events

- Test: subscribe recibe notificaciones
- Test: unsubscribe deja de recibir
- Test: multiples subscribers reciben la misma notificacion
- Test: notify sin subscribers no falla

## QA-02: Tests del endpoint SSE

- Test: endpoint retorna Content-Type text/event-stream
- Test: endpoint envia estado del juego al notificar
- Test: cleanup al cerrar conexion

## QA-03: Tests de integracion

- Test: accion de un jugador se refleja en el otro sin reload
- Test: indicador de conexion cambia segun estado SSE
- Test: reconexion automatica tras desconexion
