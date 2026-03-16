# Story 08: Feedback visual y validacion

## Descripcion

El juego debe guiar visualmente al jugador en cada momento, mostrando que puede hacer, que acaba de pasar y que esta prohibido. La validacion impide jugadas invalidas y el feedback visual hace que la experiencia sea fluida y sin confusion, especialmente para ninos.

## Requisitos

### Indicador de turno

- Debe quedar claro en todo momento de quien es el turno
- El area del jugador activo se destaca (color, brillo, borde) respecto al que espera
- Texto o etiqueta: "Tu turno" visible junto al jugador activo

### Seleccion de mano

- Al tocar una mano propia viva, se marca como seleccionada (borde destacado, brillo, escala)
- Las manos rivales validas como objetivo se resaltan para indicar que son interactivas
- Las manos muertas se ven opacas, grises o con un indicador de "no disponible"

### Feedback tras accion

- Tras un ataque: la mano objetivo muestra brevemente el cambio de valor (transicion visual)
- Tras una eliminacion: la mano muestra claramente que ha pasado a 0 (cambio visual inmediato)
- Tras un reparto: ambas manos del jugador actualizan sus valores con una transicion breve
- Tras cambio de turno: el indicador de turno se actualiza visualmente

### Prevencion de jugadas invalidas

- No se puede interactuar con manos del rival durante la seleccion de mano atacante
- No se puede interactuar con manos muertas en ningun caso (salvo a traves de reparto)
- No se puede interactuar con el tablero cuando no es tu turno
- No se puede interactuar con el tablero cuando la partida ha terminado
- Si el jugador intenta una accion no permitida, no ocurre nada (sin mensajes de error intrusivos)
- Pulsaciones rapidas consecutivas no deben producir estados inconsistentes

### Numeros visibles

- Cada mano muestra su valor numerico de forma clara y grande
- No depender solo del color o de la representacion grafica de dedos para comunicar el valor
- Los numeros deben ser legibles en pantallas pequenas

### Accesibilidad basica

- No depender exclusivamente del color para comunicar estados (activo/muerto, turno, seleccion)
- Botones suficientemente grandes para uso tactil en movil (minimo 44x44 puntos)
- Contraste suficiente entre texto y fondo

## Flujo del usuario

Estas interacciones ocurren como parte del flujo natural de las stories 02 a 06. No representan un flujo independiente, sino una capa de experiencia que acompana todas las acciones del juego.

## Fuera de alcance

- Animaciones complejas o particulas
- Sonidos
- Vibracion haptica
- Modo oscuro
- Soporte completo de lectores de pantalla (solo accesibilidad basica visual)
