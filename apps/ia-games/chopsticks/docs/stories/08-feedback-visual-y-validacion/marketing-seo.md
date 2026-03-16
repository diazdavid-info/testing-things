# Story 08 — Tareas de marketing y SEO

## SEO-01: Accesibilidad como diferenciador

- Verificar que la app cumple WCAG AA en todos los aspectos medibles:
  - Contraste de colores
  - Navegacion por teclado
  - Lectores de pantalla
  - No depender solo del color
- Documentar el nivel de accesibilidad alcanzado para comunicacion externa
- Esto puede ser un punto de diferenciacion frente a otros juegos casuales

## MKT-01: Eventos de analytics de interaccion

- Definir evento:
  - `invalid_move_attempted`: cuando el jugador intenta una accion invalida (tocar mano muerta, actuar fuera de turno). Datos: tipo de accion intentada, contexto
- Nota: este evento es util para medir la tasa de errores de interaccion y mejorar la UX
- Registrar como stub para futuro uso

## MKT-02: Verificacion de rendimiento para Core Web Vitals

- Asegurar que las animaciones y transiciones no degradan los Core Web Vitals
- CLS < 0.1 (las transiciones no deben mover elementos de forma inesperada)
- INP < 200ms (las interacciones deben responder rapidamente)
- Verificar con Lighthouse en produccion
