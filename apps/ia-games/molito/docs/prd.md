# PRD --- Juego del Molino (Nine Men's Morris)

## 1. Visión del producto

Desarrollar una versión digital del **Juego del Molino** que permita a
dos jugadores competir colocando y moviendo fichas en un tablero con el
objetivo de formar molinos (tres fichas alineadas) para eliminar piezas
del rival.

Los jugadores deben poder jugar desde dispositivos distintos,
compartiendo un enlace o código de partida.

El producto debe ser:

-   Fácil de entender\
-   Fiel a las reglas tradicionales\
-   Rápido de empezar\
-   Jugable desde cualquier dispositivo\
-   Sin necesidad de crear cuenta

------------------------------------------------------------------------

# 2. Objetivos

## Objetivos del producto

-   Permitir crear una partida en menos de **5 segundos**
-   Permitir que un segundo jugador se una fácilmente mediante **link o
    código**
-   Garantizar que las reglas del juego se aplican correctamente

## Métricas de éxito

-   \% de partidas donde se une el segundo jugador
-   Tiempo medio hasta que comienza la partida
-   \% de partidas finalizadas
-   Nº de partidas por sesión

------------------------------------------------------------------------

# 3. Público objetivo

-   Jugadores casuales
-   Personas que conocen el juego tradicional
-   Amigos o familiares jugando desde distintos dispositivos

Edad estimada: **10+**

------------------------------------------------------------------------

# 4. Reglas del juego

El Molino se juega entre **2 jugadores**.

Cada jugador tiene **9 fichas**.

El juego tiene **3 fases**.

## Fase 1 --- Colocación

Los jugadores colocan fichas alternadamente en posiciones vacías del
tablero.

Objetivo:

Formar un **molino** (3 fichas alineadas).

Cuando un jugador forma un molino:

-   Puede eliminar una ficha del rival

Reglas para eliminar:

-   No se puede eliminar una ficha que esté en molino
-   Excepto si **todas las fichas del rival están en molinos**

## Fase 2 --- Movimiento

Cuando ambos jugadores han colocado sus **9 fichas**.

Los jugadores pueden:

-   Mover una ficha por turno
-   Solo a **posiciones adyacentes conectadas**

Si se forma un molino:

-   Se elimina una ficha rival

## Fase 3 --- Vuelo

Cuando un jugador tiene **3 fichas restantes**.

Puede mover una ficha a **cualquier posición libre del tablero**.

## Fin de partida

Un jugador pierde si:

-   Tiene **menos de 3 fichas**
-   No puede realizar **ningún movimiento válido**

------------------------------------------------------------------------

# 5. Multijugador

El juego permite que **dos jugadores participen desde dispositivos
diferentes**.

No se requiere registro.

## Crear partida

Un jugador puede crear una nueva partida.

El sistema generará:

-   Un **link único**
-   Un **código corto de partida**

Ejemplo:

    https://game.com/molino/ABCD1234

Código:

    ABCD

El jugador puede:

-   Copiar el link
-   Compartir el código

## Unirse a partida

El segundo jugador puede:

-   Abrir el **link de invitación**
-   Introducir el **código de partida**

Restricciones:

-   Solo pueden unirse **2 jugadores**
-   Si la partida ya tiene 2 jugadores → se muestra mensaje de **partida
    llena**

## Estados de partida

Una partida puede estar en:

-   `waiting`
-   `playing`
-   `finished`

### waiting

-   Solo hay un jugador
-   Se muestra pantalla de invitación

### playing

-   Hay dos jugadores
-   Comienza la partida

### finished

-   Hay ganador

------------------------------------------------------------------------

# 6. Experiencia de usuario

## Flujo del jugador 1

1.  Abrir el juego
2.  Pulsar **Crear partida**
3.  Se genera link y código
4.  Comparte con otro jugador
5.  Espera a que el otro jugador se una

## Flujo del jugador 2

1.  Recibe link o código
2.  Abre el link o introduce el código
3.  Se une a la partida
4.  Empieza el juego

------------------------------------------------------------------------

# 7. Interfaz

## Pantalla de espera

Elementos:

-   Código de partida
-   Botón **copiar link**
-   Botón **copiar código**
-   Indicador **esperando jugador**

## Tablero

Tablero clásico con **24 posiciones**.

Elementos:

-   Posiciones interactivas
-   Líneas de conexión
-   Fichas de cada jugador
-   Indicador de turno

------------------------------------------------------------------------

# 8. Interacciones

## Colocar ficha

Tap / click en una **posición vacía**

## Mover ficha

1.  Seleccionar ficha
2.  Seleccionar destino válido

## Eliminar ficha

Tap en **ficha rival válida**

------------------------------------------------------------------------

# 9. Validaciones del sistema

El sistema debe validar:

-   Solo **2 jugadores por partida**
-   Turnos alternos
-   Posiciones válidas
-   Movimiento solo a posiciones conectadas
-   Vuelo cuando quedan **3 fichas**
-   Formación de molinos
-   Eliminación válida de fichas
-   Fin de partida

------------------------------------------------------------------------

# 10. Modelo de datos

## Game

    id
    code
    status
    player1
    player2
    board
    phase
    turn
    winner
    createdAt

## Player

    id
    piecesToPlace
    piecesOnBoard

## Board

    positions[24]

Valores posibles:

    null
    player1
    player2

------------------------------------------------------------------------

# 11. Estados del turno

Un turno puede ser:

    PLACE
    MOVE
    REMOVE

Ejemplo:

    Jugador coloca
    → se forma molino
    → REMOVE
    → siguiente jugador

------------------------------------------------------------------------

# 12. Persistencia

Se debe guardar:

-   Estado del tablero
-   Jugadores
-   Turno actual
-   Fase
-   Historial de movimientos (opcional)

------------------------------------------------------------------------

# 13. Edge cases

El sistema debe manejar:

-   Intentar unirse a **partida llena**
-   **Código inválido**
-   Intentar mover ficha rival
-   Intentar mover a posición ocupada
-   Intentar eliminar ficha no válida
-   Jugador que abandona partida

------------------------------------------------------------------------

# 14. V1 Alcance

Incluye:

-   Juego entre **2 jugadores remotos**
-   Join por **link o código**
-   Motor de reglas
-   UI básica
-   Reiniciar partida

No incluye:

-   IA
-   Ranking
-   Chat
-   Sistema de cuentas

------------------------------------------------------------------------

# 15. Roadmap futuro

## V2

-   IA
-   Revancha automática

## V3

-   Ranking
-   Usuarios

## V4

-   Animaciones
-   Historial de partidas
