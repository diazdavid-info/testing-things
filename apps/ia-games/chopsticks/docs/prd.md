# PRD — Juego de los Dedos

## 1. Resumen del producto

Juego por turnos para 2 jugadores en el que cada jugador controla dos manos. Cada mano tiene un número de dedos “activos”. En cada turno, un jugador puede:

- **Atacar** una mano rival sumando a ella los dedos de una de sus manos activas.
- **Repartir** sus dedos entre sus propias manos para cambiar su estado estratégico.

El objetivo es eliminar las dos manos del rival. Una mano queda eliminada cuando alcanza o supera el límite definido del juego.

Este producto debe estar pensado para partidas rápidas, reglas simples, interfaz clara y posibilidad de jugar localmente o en remoto en una fase posterior.

## 2. Objetivo del producto

Construir una versión digital del juego que sea:

- fácil de entender para niños y adultos,
- rápida de jugar,
- suficientemente estratégica para permitir rejugabilidad,
- extensible a futuras variantes y modos de partida.

## 3. Problema que resuelve

Hoy este juego se juega de manera informal con reglas ambiguas. Eso provoca:

- discusiones sobre qué jugadas son válidas,
- confusión sobre cuándo una mano muere,
- dificultad para enseñar el juego a nuevos jugadores,
- ausencia de una experiencia digital sencilla para jugar en cualquier momento.

La app debe resolver esto definiendo reglas claras, validando las jugadas y guiando a los jugadores turno a turno.

## 4. Público objetivo

### Público principal
- Padres y madres jugando con hijos.
- Niños a partir de 6–7 años.
- Usuarios casuales que quieren juegos de estrategia muy simples.

### Público secundario
- Amigos que quieren partidas rápidas de 1–3 minutos.
- Usuarios móviles que buscan juegos de turnos sencillos.
- Personas interesadas en juegos abstractos y matemáticos simples.

## 5. Propuesta de valor

- Partidas cortas y fáciles de empezar.
- Reglas claras sin discusiones.
- Interfaz visual inmediata.
- La mecánica de **reparto** añade estrategia real sin volver complejo el juego.
- Base ideal para multijugador local y online.

## 6. Principios de diseño

- **Claridad primero**: el usuario debe entender de un vistazo el estado de cada mano.
- **Pocas acciones, mucha intención**: atacar o repartir.
- **Cero ambigüedad**: el sistema impide jugadas inválidas.
- **Ritmo rápido**: una jugada válida debe hacerse en pocos toques.
- **Pensado para niños**: feedback visual y lenguaje simple.

## 7. Alcance MVP

El MVP debe incluir:

- partida de 2 jugadores en el mismo dispositivo,
- reglas completas del juego,
- acción de ataque,
- acción de reparto,
- detección automática de victoria,
- validación de jugadas,
- reinicio de partida,
- tutorial breve o ayuda visual,
- sistema básico de estados y animaciones.

No entra en MVP:

- matchmaking online,
- perfiles de usuario,
- rankings,
- historial de partidas persistente,
- chat,
- IA avanzada.

## 8. Reglas funcionales del juego

### 8.1 Estado inicial
- Cada jugador empieza con:
  - mano izquierda = 1
  - mano derecha = 1
- Ambas manos están vivas.

Representación inicial:
- Jugador A: [1, 1]
- Jugador B: [1, 1]

### 8.2 Turnos
- Los jugadores juegan por turnos alternos.
- En cada turno, el jugador activo debe realizar exactamente una acción:
  - **atacar**
  - **repartir**

### 8.3 Acción: atacar
Un ataque consiste en:

- elegir una mano propia viva,
- elegir una mano rival viva,
- sumar los dedos de la mano atacante a la mano objetivo.

#### Ejemplo
- Jugador A tiene [2, 1]
- Jugador B tiene [1, 3]
- A usa su mano de 2 para atacar la mano de 3 de B
- La mano objetivo pasa de 3 a 5

### 8.4 Eliminación de mano
Regla del producto:

- Cuando una mano llega a **5 o más**, queda eliminada.
- Una mano eliminada pasa a valor **0**.
- Una mano en 0:
  - no puede atacar,
  - no puede ser objetivo de reparto,
  - no puede recibir ataques.

#### Nota
Esta decisión elimina ambigüedad y simplifica UX. No se usará módulo 5 en el MVP.

### 8.5 Acción: repartir
La variante divertida será obligatoria y parte central del juego.

Repartir consiste en redistribuir entre las dos manos del jugador activo el número total de dedos vivos que tiene en ese momento.

#### Condiciones
- El total de dedos tras repartir debe ser el mismo que antes.
- No se puede superar el valor 4 en una mano viva.
- Los valores válidos tras repartir deben estar entre 0 y 4.
- La acción debe producir un **estado distinto** al anterior.
- No puede revivir manos eliminadas si esa regla se decide bloquear. Esto debe definirse claramente en producto.

#### Decisión para MVP
Para el MVP propongo:

- **Sí se permite revivir una mano a través de reparto**.
- Esto hace el juego más estratégico y evita estancamientos pobres.

#### Ejemplo 1
- Estado actual: [4, 0]
- Reparto válido: [2, 2]

#### Ejemplo 2
- Estado actual: [3, 1]
- Reparto válido: [2, 2]

#### Ejemplo 3
- Estado actual: [2, 1]
- Reparto inválido: [2, 1] porque no cambia el estado

#### Ejemplo 4
- Estado actual: [4, 1]
- No existe reparto válido, porque el total es 5 y una mano no puede quedar en 5 viva.
- En este caso no se puede usar “repartir”.

### 8.6 Fin de partida
- Un jugador pierde cuando sus dos manos están en 0.
- El otro jugador gana inmediatamente.
- Debe mostrarse una pantalla de victoria clara con opción de revancha.

## 9. Decisiones de reglas para producto

Estas reglas deben fijarse y no dejarse ambiguas:

### Regla 1: eliminación
- Una mano muere con **5 o más**.

### Regla 2: revivir mediante reparto
- **Permitido**.

### Regla 3: reparto idéntico
- **No permitido**. Repartir debe cambiar el estado.

### Regla 4: orden de manos
- Las manos izquierda y derecha son posiciones visuales.
- Aunque matemáticamente [1,3] y [3,1] tengan el mismo total, para UX siguen siendo estados distintos visuales.
- A nivel de validación de reparto, el jugador puede asignar libremente los valores a izquierda/derecha.

### Regla 5: manos muertas
- Las manos con 0 son manos muertas y no interactúan hasta que se revivan por reparto.

## 10. Objetivos del usuario

### Como jugador
- Quiero empezar una partida en segundos.
- Quiero entender fácilmente qué jugadas puedo hacer.
- Quiero ver claramente cuántos dedos tiene cada mano.
- Quiero que el juego me impida movimientos inválidos.
- Quiero ganar eliminando las dos manos del rival.
- Quiero poder usar el reparto como jugada estratégica.

### Como padre/madre
- Quiero que el juego sea claro para jugar con mi hijo.
- Quiero pocas reglas y bien explicadas.
- Quiero partidas rápidas y sin discusiones.

## 11. User stories

### Inicio de partida
- Como jugador, quiero empezar una partida nueva para jugar inmediatamente.
- Como jugador, quiero ver una explicación breve de reglas antes de jugar mi primera partida.

### Juego base
- Como jugador, quiero seleccionar una mano propia para usarla.
- Como jugador, quiero seleccionar una mano rival para atacarla.
- Como jugador, quiero ver el resultado del ataque al instante.
- Como jugador, quiero que una mano eliminada se vea claramente como inactiva.

### Reparto
- Como jugador, quiero elegir la acción “repartir”.
- Como jugador, quiero ver qué repartos son válidos antes de confirmar.
- Como jugador, quiero poder revivir una mano usando el reparto si el total lo permite.
- Como jugador, quiero que el sistema me impida hacer repartos ilegales.

### Final de partida
- Como jugador, quiero saber cuándo he ganado o perdido.
- Como jugador, quiero reiniciar o jugar otra vez sin salir de la pantalla.

## 12. Flujos principales

### 12.1 Flujo de nueva partida
1. Usuario entra en pantalla principal.
2. Pulsa “Nueva partida”.
3. Se inicializa el estado:
   - P1: [1,1]
   - P2: [1,1]
4. Se indica quién empieza.
5. Empieza el turno 1.

### 12.2 Flujo de ataque
1. El jugador activo pulsa una de sus manos vivas.
2. La UI marca esa mano como seleccionada.
3. El usuario pulsa una mano viva del rival.
4. El sistema valida la jugada.
5. Se actualiza el valor de la mano rival.
6. Si el resultado es >= 5, esa mano pasa a 0.
7. Se comprueba condición de victoria.
8. Si no hay victoria, cambia el turno.

### 12.3 Flujo de reparto
1. El jugador activo pulsa “Repartir”.
2. El sistema abre una UI de selección de nueva distribución.
3. Solo se muestran opciones válidas.
4. El jugador elige una nueva distribución.
5. El sistema actualiza sus dos manos.
6. Se comprueba condición de victoria solo por consistencia de estado, aunque no debería dispararse aquí.
7. Cambia el turno.

## 13. Requisitos funcionales

### 13.1 Gestión de partida
- El sistema debe permitir iniciar una nueva partida.
- El sistema debe permitir reiniciar la partida actual.
- El sistema debe mantener el estado actual hasta fin de partida o reinicio.

### 13.2 Lógica de turnos
- El sistema debe identificar el jugador activo.
- El sistema debe impedir acciones del jugador no activo.
- El sistema debe cambiar de turno tras una acción válida.

### 13.3 Ataques
- El sistema debe permitir seleccionar solo manos propias vivas como atacante.
- El sistema debe permitir seleccionar solo manos rivales vivas como objetivo.
- El sistema debe sumar correctamente el valor atacante al objetivo.
- El sistema debe eliminar la mano objetivo si el resultado es >= 5.

### 13.4 Reparto
- El sistema debe calcular el total actual de dedos del jugador.
- El sistema debe generar solo repartos válidos.
- El sistema debe impedir repartir al mismo estado actual.
- El sistema debe permitir repartir para revivir una mano si la suma total lo hace posible.
- El sistema debe impedir estados con manos > 4.

### 13.5 Fin de partida
- El sistema debe detectar cuándo un jugador tiene [0,0].
- El sistema debe declarar ganador al rival.
- El sistema debe bloquear nuevas acciones salvo reinicio o nueva partida.

### 13.6 Ayuda y onboarding
- El sistema debe mostrar reglas básicas.
- El sistema debe explicar el reparto con al menos un ejemplo.

### 13.7 Feedback visual
- La mano seleccionada debe destacarse.
- Las manos eliminadas deben verse desactivadas.
- Tras un ataque o reparto, la UI debe actualizarse con feedback inmediato.
- Debe mostrarse de quién es el turno.

## 14. Requisitos no funcionales

### Usabilidad
- Un niño debe poder entender el estado del juego sin leer mucho texto.
- Cada jugada debe poder completarse en 1–3 interacciones.

### Rendimiento
- La actualización del estado debe ser instantánea.
- No hay dependencia de backend en MVP local.

### Fiabilidad
- La lógica del juego debe estar desacoplada de la UI.
- Las reglas deben ser testeables con unit tests.

### Accesibilidad
- No depender solo del color para mostrar estados.
- Incluir etiquetas o números visibles en cada mano.
- Botones suficientemente grandes para móvil.

### Compatibilidad
- Pensado mobile-first.
- Adaptable a desktop.

## 15. UI / UX propuesta

### 15.1 Pantalla principal
- Botón “Nueva partida”
- Botón “Cómo jugar”
- Opcional: “Última partida” en futuras versiones

### 15.2 Pantalla de juego
Elementos:
- Área del rival arriba
- Área del jugador abajo
- Dos manos por jugador
- Indicador de turno
- Botón “Repartir”
- Botón “Reiniciar”

Cada mano debe mostrar:
- número de dedos actual,
- estado visual activo/muerto,
- selección actual si aplica.

### 15.3 Modal o panel de reparto
Opciones posibles:
- mostrar botones con distribuciones válidas, por ejemplo:
  - [2,2]
  - [3,1]
  - [4,0]
- el usuario toca una opción y confirma.

Esto es mejor que un input libre.

### 15.4 Pantalla final
- Mensaje de victoria:
  - “Gana Jugador 1”
- Botones:
  - “Revancha”
  - “Nueva partida”

## 16. Modelo de dominio

### Entidades principales

#### Game
- id
- status: `not_started | active | finished`
- currentPlayerId
- winnerPlayerId
- ruleset

#### Player
- id
- name
- leftHandValue
- rightHandValue

#### Move
- type: `attack | split`
- playerId
- sourceHand
- targetHand
- previousState
- nextState
- timestamp

#### Ruleset
- eliminationThreshold = 5
- eliminationMode = `gte`
- allowSplit = true
- allowReviveOnSplit = true

## 17. Estados y máquina de juego

Estados principales:
- `idle`
- `player_turn`
- `selecting_attack_source`
- `selecting_attack_target`
- `selecting_split`
- `animating_result`
- `game_over`

Transiciones:
- `idle -> player_turn`
- `player_turn -> selecting_attack_source`
- `selecting_attack_source -> selecting_attack_target`
- `selecting_attack_target -> animating_result`
- `player_turn -> selecting_split`
- `selecting_split -> animating_result`
- `animating_result -> player_turn`
- `animating_result -> game_over`

## 18. Reglas de validación detalladas

### 18.1 Ataque válido si
- la mano atacante pertenece al jugador activo,
- la mano atacante tiene valor > 0,
- la mano objetivo pertenece al rival,
- la mano objetivo tiene valor > 0,
- la partida no está terminada.

### 18.2 Reparto válido si
- la acción la realiza el jugador activo,
- la partida no está terminada,
- la suma de ambas manos antes y después es la misma,
- ambos valores tras repartir están entre 0 y 4,
- el nuevo estado es distinto al anterior,
- si el diseño quiere evitar equivalencias duplicadas, puede normalizar opciones.

## 19. Casos borde importantes

- Atacar con una mano muerta.
- Atacar una mano muerta.
- Intentar repartir sin cambiar estado.
- Intentar repartir a una mano con valor 5.
- Llegar a [0,0] tras un ataque.
- Revivir desde [4,0] a [2,2].
- Estado [2,2] repartido a [1,3].
- Reiniciar a mitad de partida.
- Pulsaciones rápidas consecutivas.
- Cambio de turno tras animación.

## 20. Telemetría recomendada

Aunque sea MVP, conviene dejar preparado:

Eventos:
- `game_started`
- `move_attack`
- `move_split`
- `invalid_move_attempted`
- `game_finished`
- `tutorial_opened`
- `rematch_started`

Datos útiles:
- duración de partida,
- número de turnos,
- uso del reparto,
- ratio de victorias por jugador inicial.

## 21. Métricas de éxito

### MVP
- % de partidas completadas
- tiempo medio hasta primera partida
- número medio de turnos por partida
- uso del reparto por partida
- tasa de errores de interacción

### Señales de calidad
- pocas jugadas inválidas por usuario,
- partidas de duración corta,
- alta tasa de revancha.

## 22. Riesgos

### Riesgo 1: reglas ambiguas
Mitigación:
- bloquear variantes no soportadas,
- explicar claramente las reglas elegidas.

### Riesgo 2: UX confusa al repartir
Mitigación:
- mostrar solo opciones válidas,
- no usar inputs manuales.

### Riesgo 3: falta de profundidad
Mitigación:
- mantener el reparto como acción principal del diseño,
- considerar futuras variantes.

## 23. Futuras extensiones

- modo vs IA,
- multijugador online,
- compartir partida por link o código,
- historial de partidas,
- reglas alternativas:
  - exacto a 5,
  - módulo 5,
  - sin revivir,
- ranking casual,
- skins o temas visuales,
- modo torneo.

## 24. Recomendaciones técnicas

### Arquitectura
Separar:
- motor de reglas puro,
- capa de estado de partida,
- UI.

### Muy importante
La lógica del juego debe ser una capa independiente y testeable, con funciones puras como:

- `getValidAttackTargets(state, player, sourceHand)`
- `applyAttack(state, sourceHand, targetHand)`
- `getValidSplits(state, player)`
- `applySplit(state, distribution)`
- `checkWinner(state)`

Así evitas mezclar reglas con componentes de interfaz.

## 25. Criterios de aceptación del MVP

### Nueva partida
- Dado que el usuario inicia una partida,
- cuando entra en la pantalla de juego,
- entonces ambos jugadores deben empezar con [1,1].

### Ataque
- Dado que el jugador activo tiene una mano viva,
- cuando selecciona esa mano y luego una mano viva rival,
- entonces el valor rival debe aumentar correctamente.

### Eliminación
- Dado que una mano rival alcanza 5 o más tras un ataque,
- cuando se resuelve la acción,
- entonces esa mano debe pasar a 0 y verse eliminada.

### Reparto
- Dado que el jugador activo tiene una suma redistribuible válida,
- cuando abre la acción de reparto,
- entonces el sistema debe mostrar solo opciones válidas.

### Reparto con resurrección
- Dado un estado [4,0],
- cuando el jugador elige [2,2],
- entonces la mano muerta debe revivirse correctamente.

### Victoria
- Dado que un jugador queda con [0,0],
- cuando termina la acción que produce ese estado,
- entonces la partida debe finalizar y mostrar ganador.

## 26. Propuesta de backlog inicial

### Épica 1: Motor del juego
- modelado de estado,
- reglas de ataque,
- reglas de reparto,
- detección de fin de partida,
- tests unitarios.

### Épica 2: Interfaz base
- layout de tablero,
- representación de manos,
- selección de acciones,
- feedback de turno y selección.

### Épica 3: Flujo de partida
- nueva partida,
- reinicio,
- victoria,
- revancha.

### Épica 4: Onboarding
- ayuda,
- tutorial corto,
- ejemplos visuales.

### Épica 5: Calidad
- manejo de edge cases,
- analytics,
- accesibilidad básica.

## 27. Definición de terminado

Una versión se considera terminada para MVP cuando:

- se puede jugar una partida completa de principio a fin,
- todas las reglas descritas están implementadas,
- no hay jugadas inválidas permitidas,
- el reparto funciona y forma parte real de la estrategia,
- la UI permite jugar sin explicación externa,
- la lógica crítica tiene tests automatizados.
