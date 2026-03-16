# Story 04 — Tareas de marketing y SEO

## MKT-01: Eventos de analytics de eliminacion

- Definir evento:
  - `hand_eliminated`: cuando una mano es eliminada por un ataque. Datos: jugador afectado, mano eliminada, valor del ataque
- Registrar como stub para futuro uso

## MKT-02: Accesibilidad del estado eliminado

- Las manos eliminadas deben tener `aria-label` que incluya "eliminada" o "fuera de juego"
- Los lectores de pantalla deben poder distinguir manos vivas de muertas
- No depender solo del color o la opacidad para comunicar el estado eliminado
