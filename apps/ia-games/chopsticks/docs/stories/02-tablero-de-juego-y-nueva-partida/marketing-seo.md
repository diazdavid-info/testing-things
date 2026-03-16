# Story 02 — Tareas de marketing y SEO

## SEO-01: Metadatos de la pagina de juego

- `<title>`: "Partida — Juego de los Dedos"
- `<meta name="description">`: descripcion breve de la pantalla de juego
- Mantener `<html lang="es">`

## SEO-02: Estructura semantica del tablero

- Usar `<main>` para el area de juego
- Cada area de jugador es una `<section>` con `aria-label` descriptivo
- Las manos son botones interactivos (`<button>`) con `aria-label` que incluye el valor
- El indicador de turno tiene `role="status"` para lectores de pantalla

## MKT-01: Eventos de analytics del tablero

- Definir eventos:
  - `game_started`: cuando se inicia una partida nueva
  - `game_restarted`: cuando se pulsa "Reiniciar"
- Registrar como stubs para futuro uso
