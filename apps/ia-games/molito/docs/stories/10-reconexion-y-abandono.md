# Story 10: Reconexion y abandono

## Descripcion

Si un jugador pierde la conexion (cierra el navegador, pierde red, cambia de pestana, etc.), debe poder volver a la partida y continuar jugando. Si un jugador abandona de forma prolongada, el otro no debe quedarse esperando indefinidamente.

## Requisitos

### Reconexion

- Si un jugador abre el link de una partida en la que ya participa, se reconecta automaticamente
- Al reconectarse, recibe el estado completo actual de la partida (tablero, turno, fase, contadores)
- La partida continua desde donde se dejo
- El identificador del jugador se mantiene (via cookie, localStorage o parametro en URL)

### Notificacion de desconexion

- Si un jugador se desconecta, el otro ve un aviso: "Tu rival se ha desconectado"
- El aviso aparece tras unos segundos de gracia (para no alertar por micro-desconexiones)
- Si el rival reconecta, el aviso desaparece y la partida continua

### Abandono prolongado

- Si un jugador lleva desconectado mas de un tiempo configurable (ej: 5 minutos), el otro jugador puede "Reclamar victoria"
- Opcionalmente: pasado un timeout mas largo, la partida se marca como abandonada automaticamente
- El jugador que abandona pierde

### Partida en sala de espera

- Si el jugador 1 se desconecta mientras espera al jugador 2, la partida sigue en estado `waiting`
- El jugador 1 puede volver y seguir esperando
- Si nadie vuelve en un tiempo razonable, la partida expira y se elimina

## Flujo del usuario (reconexion)

1. Jugador pierde conexion (cierra navegador, pierde red)
2. El rival ve "Tu rival se ha desconectado"
3. El jugador vuelve a abrir el link
4. Se reconecta y ve el estado actual de la partida
5. La partida continua normalmente

## Flujo del usuario (abandono)

1. Jugador se desconecta y no vuelve
2. El rival ve "Tu rival se ha desconectado"
3. Pasan X minutos
4. El rival ve opcion "Reclamar victoria"
5. Pulsa y gana la partida

## Fuera de alcance

- Pausar partida de mutuo acuerdo
- Sistema de penalizaciones por abandono
