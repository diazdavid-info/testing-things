# Story 01: Pantalla de inicio

## Descripcion

El jugador accede al juego y ve una pantalla clara y sencilla desde la que puede crear una nueva partida o unirse a una existente introduciendo un codigo. No se requiere registro ni login.

## Requisitos

- Mostrar el nombre del juego: "El Molino"
- Boton "Crear partida" visible y destacado
- Campo de texto para introducir un codigo de partida
- Boton "Unirse" junto al campo de texto
- Si el codigo introducido no existe, mostrar mensaje "Codigo no encontrado"
- Si la partida del codigo esta llena, mostrar mensaje "Partida llena"
- El diseno debe ser responsive: funcionar correctamente en movil y escritorio
- No se requiere crear cuenta ni autenticarse

## Flujo del usuario

1. El jugador abre la URL del juego
2. Ve la pantalla de inicio
3. Opcion A: Pulsa "Crear partida" → se le redirige a la sala de espera (ver Story 02)
4. Opcion B: Introduce un codigo y pulsa "Unirse" → se le redirige a la partida (ver Story 03)

## Fuera de alcance

- Login / registro
- Listado de partidas activas
- Historial de partidas anteriores
