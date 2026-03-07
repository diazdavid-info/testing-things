# Story 02: Crear partida y sala de espera

## Descripcion

Un jugador crea una nueva partida. El sistema genera un codigo corto y un link unico que el jugador puede compartir con su rival. Mientras espera, ve una pantalla con las opciones para copiar el link o el codigo y un indicador de que esta esperando al segundo jugador.

## Requisitos

### Creacion de partida

- Al pulsar "Crear partida" se genera una nueva partida
- Se genera un codigo corto unico de 4 caracteres alfanumericos (ej: `ABCD`)
- Se genera un link unico con el formato `https://{domain}/molino/{code}`
- El jugador que crea la partida se asigna automaticamente como jugador 1
- La partida se crea en estado `waiting`

### Sala de espera

- Mostrar el codigo de partida de forma destacada y facil de leer
- Boton "Copiar link" que copia la URL completa al portapapeles
- Boton "Copiar codigo" que copia el codigo corto al portapapeles
- Al copiar, mostrar feedback visual temporal (ej: "Copiado!")
- Mostrar indicador animado "Esperando jugador..."
- Cuando el segundo jugador se une, la pantalla transiciona automaticamente al tablero de juego

## Flujo del usuario

1. Jugador 1 pulsa "Crear partida" en la pantalla de inicio
2. Se le redirige a la sala de espera
3. Ve el codigo y los botones de copiar
4. Comparte el link o codigo con su rival (por WhatsApp, Telegram, etc.)
5. Cuando el rival se une, ambos ven el tablero

## Fuera de alcance

- Compartir directamente desde la app (boton de share nativo)
- Elegir color de fichas
- Configurar reglas de la partida
