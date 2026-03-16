# Story 03: Accion de ataque

## Descripcion

El jugador activo puede atacar una mano rival usando una de sus manos vivas. El ataque consiste en sumar los dedos de la mano atacante a la mano objetivo. Si el resultado es 5 o mas, la mano objetivo queda eliminada. Este es el mecanismo principal de interaccion del juego.

## Requisitos

### Seleccion de mano atacante

- El jugador activo toca/clica una de sus manos vivas para seleccionarla como atacante
- Solo se pueden seleccionar manos con valor mayor que 0
- La mano seleccionada se destaca visualmente (borde, brillo, color)
- Si el jugador cambia de opinion, puede tocar otra mano propia para cambiar la seleccion
- Si toca la misma mano seleccionada, se deselecciona y vuelve al estado inicial del turno

### Seleccion de mano objetivo

- Una vez seleccionada la mano atacante, el jugador toca una mano viva del rival
- Solo se pueden seleccionar manos rivales con valor mayor que 0
- Las manos rivales validas deben mostrarse como interactivas (resaltadas o con indicador)
- Las manos rivales muertas (valor 0) no son seleccionables y se ven desactivadas

### Resolucion del ataque

- Al seleccionar la mano objetivo, el ataque se ejecuta inmediatamente
- El valor de la mano objetivo se actualiza: nuevo valor = valor anterior + valor de la mano atacante
- Si el nuevo valor es 5 o mas, la mano objetivo pasa a valor 0 y se muestra como eliminada
- Si el nuevo valor es menor que 5, la mano muestra su nuevo valor
- La mano atacante no cambia de valor
- Se muestra feedback visual del resultado (ver Story 08)

### Cambio de turno

- Tras resolver el ataque, el turno pasa al otro jugador
- Si el ataque elimina la segunda mano del rival (ambas en 0), la partida termina (ver Story 06)

## Flujo del usuario

1. Es el turno del jugador activo
2. Toca una de sus manos vivas → la mano se marca como seleccionada
3. Toca una mano viva del rival → el ataque se ejecuta
4. Ve el resultado: la mano rival actualiza su valor o queda eliminada
5. El turno pasa al otro jugador

### Ejemplo

- Jugador A tiene [2, 1], Jugador B tiene [1, 3]
- A selecciona su mano de 2 y ataca la mano de 3 de B
- La mano de B pasa de 3 a 5 → se elimina (pasa a 0)
- B queda con [1, 0]

## Fuera de alcance

- Atacar manos propias
- Seleccionar multiples manos a la vez
- Deshacer un ataque ya ejecutado
- Animaciones elaboradas del ataque
