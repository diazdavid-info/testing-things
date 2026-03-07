# Story 14: Auditoria de seguridad

## Descripcion

Revision exhaustiva de seguridad de la aplicacion antes de salir a produccion. El objetivo es identificar y corregir vulnerabilidades potenciales en los endpoints API, la gestion de cookies, la validacion de input, y el lado cliente.

## Vectores de ataque a revisar

### Validacion de input en APIs

- Verificar que todos los endpoints validan tipos y rangos de los campos del body (playerId, position, from, to)
- Comprobar que no se aceptan payloads excesivamente grandes (limite de body size)
- Verificar que posiciones fuera de rango (negativos, >23, decimales, strings) son rechazadas
- Comprobar que playerIds malformados no causan comportamiento inesperado

### Autenticacion y autorizacion

- Verificar que un jugador no puede actuar como otro (spoofear playerId)
- Comprobar que las cookies `playerId_{code}` no se pueden manipular para acceder a partidas ajenas
- Revisar que no hay escalacion: un jugador no puede jugar ambos turnos
- Verificar que los endpoints rechazan acciones cuando no es el turno del jugador

### Server-Sent Events (SSE)

- Verificar que el stream no filtra informacion sensible (playerIds, datos internos)
- Comprobar que un tercero conectado al SSE no puede ver los IDs de los jugadores
- Revisar limites de conexiones SSE simultaneas (posible DoS con muchas conexiones)

### Cookies

- Verificar atributos de cookies: `HttpOnly`, `SameSite`, `Secure`, `Path`
- Comprobar que las cookies no exponen mas informacion de la necesaria

### Cross-Site

- Verificar que los endpoints POST no son vulnerables a CSRF
- Comprobar headers de seguridad: `X-Content-Type-Options`, `X-Frame-Options`, etc.
- Revisar que no hay XSS en contenido renderizado del servidor

### Rate limiting y abuso

- Evaluar si se necesita rate limiting en endpoints criticos (create, join, place, move, remove)
- Identificar si un bot podria abusar del sistema creando miles de partidas

### Informacion expuesta

- Verificar que errores del servidor no exponen stack traces o rutas internas
- Comprobar que el endpoint `/api/games/{code}/state` no expone datos sensibles
- Revisar que los codigos de partida tienen suficiente entropia (4 chars, 31 chars = ~20 bits)

## Criterios de aceptacion

- Cada vulnerabilidad encontrada se documenta y se corrige
- Se anaden tests para cada correccion de seguridad
- Todos los tests existentes siguen pasando
- Se genera un informe breve con hallazgos y acciones tomadas

## Fuera de alcance

- Penetration testing externo
- Auditoria de dependencias (npm audit) — puede hacerse por separado
- Configuracion de infraestructura (firewall, WAF) — eso es responsabilidad de Coolify
