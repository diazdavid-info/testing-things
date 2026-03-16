# Story 06 — Tareas de marketing y SEO

## MKT-01: Eventos de analytics de fin de partida

- Definir eventos:
  - `game_finished`: cuando una partida termina. Datos: ganador, numero de turnos, duracion estimada
  - `rematch_started`: cuando se pulsa "Revancha"
  - `return_to_home`: cuando se pulsa "Volver al inicio" desde la pantalla de victoria
- Registrar como stubs para futuro uso

## MKT-02: Copywriting de la pantalla de victoria

- Mensaje de victoria: "Gana Jugador 1" / "Gana Jugador 2"
- Boton primario: "Revancha"
- Boton secundario: "Volver al inicio"
- Tono celebratorio pero simple, comprensible para ninos
- Sin textos extensos

## MKT-03: Accesibilidad de la pantalla de victoria

- El overlay debe tener `role="dialog"` y `aria-modal="true"`
- El foco debe moverse al overlay al aparecer
- El mensaje de victoria debe ser anunciado por lectores de pantalla
- Los botones deben ser alcanzables por teclado (Tab + Enter)
