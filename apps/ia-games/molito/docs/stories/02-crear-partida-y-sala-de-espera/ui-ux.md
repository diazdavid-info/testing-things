# Story 02 — Tareas de UI/UX (Pencil)

## UX-01: Disenar pantalla de sala de espera — Desktop

- Layout centrado con card similar a la pantalla de inicio
- Elementos de arriba a abajo:
  - Titulo "Tu partida esta lista" o similar
  - Codigo de partida grande y destacado (monospace, tamano prominente, fondo sutil)
  - Dos botones: "Copiar link" y "Copiar codigo" (lado a lado o apilados)
  - Indicador animado "Esperando jugador..." con animacion sutil (pulso o puntos)
  - Link o boton secundario "Volver al inicio"
- El codigo debe ser el elemento con mayor peso visual
- Los botones de copiar deben ser claramente accionables

## UX-02: Disenar pantalla de sala de espera — Mobile

- Adaptar el layout a pantallas pequenas
- El codigo sigue siendo el elemento dominante
- Los botones de copiar se apilan verticalmente y ocupan ancho completo
- El indicador "Esperando jugador..." se mantiene visible

## UX-03: Disenar estado de feedback "Copiado!"

- Al pulsar "Copiar link" o "Copiar codigo", el boton cambia temporalmente
- Opciones de feedback:
  - Texto del boton cambia a "Copiado!" con icono de check
  - Color del boton cambia brevemente (ej: verde suave)
- El feedback dura ~2 segundos y vuelve al estado original
- Disenar ambos estados: antes y despues de copiar

## UX-04: Disenar estado de partida no encontrada

- Si el jugador accede a un codigo invalido, mostrar pantalla de error
- Mensaje: "Partida no encontrada"
- Subtexto: "El codigo no existe o la partida ha expirado"
- Boton "Volver al inicio"
- Diseno coherente con la pantalla de inicio (misma card, misma tipografia)

## UX-05: Disenar transicion de espera a juego

- Cuando el rival se une, mostrar brevemente un mensaje de confirmacion
- Opciones:
  - El indicador "Esperando jugador..." cambia a "Jugador conectado!" con check
  - Transicion suave (fade) al tablero de juego
- La transicion debe ser clara pero no demorar el inicio del juego
