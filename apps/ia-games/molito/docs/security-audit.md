# Auditoria de seguridad — El Molino

## Resumen

Auditoria realizada sobre todos los endpoints API, gestion de cookies, SSE, y renderizado server-side.

## Hallazgos y correcciones

### CORREGIDO — Cookies sin HttpOnly (Alta)
- **Antes**: `playerId_{code}=...; Path=/; SameSite=Lax`
- **Despues**: `playerId_{code}=...; Path=/molino/{code}; HttpOnly; SameSite=Strict; Max-Age=86400`
- **Cambios**: Cookies ahora son HttpOnly (no accesibles desde JS), SameSite=Strict (proteccion CSRF), Path limitado al juego, Max-Age de 24h
- **Archivos**: `api-helpers.ts`, `index.ts`, `join.ts`

### CORREGIDO — SSE sin autenticacion (Alta)
- **Antes**: Cualquier persona podia conectarse a `/api/games/{code}/stream` y observar el estado completo del juego
- **Despues**: El endpoint rechaza con 403 si el playerId no corresponde a un jugador de la partida
- **Archivo**: `stream.ts`

### CORREGIDO — Validacion de input debil (Media)
- **Antes**: Los endpoints aceptaban cualquier tipo para position/from/to/playerId (strings, decimales, NaN)
- **Despues**: Validacion explicita con `validatePosition()` (entero, 0-23) y `validatePlayerId()` (string, 1-100 chars)
- **Archivos**: `api-helpers.ts`, `place.ts`, `move.ts`, `remove.ts`, `claim-victory.ts`, `rematch.ts`

### CORREGIDO — Headers de seguridad ausentes (Media)
- **Antes**: Ninguna respuesta API incluia headers de seguridad
- **Despues**: Todas las respuestas incluyen `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- **Archivo**: `api-helpers.ts`

### CORREGIDO — Payload size sin limite (Baja)
- **Antes**: No habia limite en el tamano del body JSON
- **Despues**: Rechaza payloads mayores a 1KB con 413
- **Archivo**: `api-helpers.ts`

### ACEPTADO — Entropia de codigos de partida (Baja)
- 4 caracteres × 31 opciones = ~20 bits de entropia (~923K combinaciones)
- Para un juego casual sin datos sensibles, es aceptable
- Mitigacion: el SSE ahora requiere playerId valido, asi que observar una partida requiere ser jugador

### ACEPTADO — Rate limiting (Info)
- No se implementa rate limiting a nivel de aplicacion
- Se recomienda configurar a nivel de reverse proxy en Coolify (nginx/caddy)
- Riesgo bajo: el juego es efimero y sin persistencia

### ACEPTADO — Memoria sin limpieza (Info)
- Las partidas se almacenan en memoria sin garbage collection
- Para un MVP esto es aceptable; el servidor se reiniciara periodicamente
- Para produccion a escala, considerar limpiar partidas > 24h

### NO APLICA — XSS
- Astro renderiza en servidor con escape automatico de variables
- No hay `set:html` ni dangerouslySetInnerHTML
- No se refleja input de usuario en HTML sin escape

### NO APLICA — SQL Injection
- No hay base de datos; todo es in-memory

## Tests de seguridad anadidos

18 nuevos tests en `security.test.ts`:
- Validacion de posiciones (NaN, Infinity, decimales, negativos, strings)
- Validacion de playerId (vacio, null, longitud excesiva)
- Atributos de cookies (HttpOnly, SameSite=Strict, Path, Max-Age)
- Headers de seguridad (X-Content-Type-Options, X-Frame-Options)
- Autenticacion SSE (rechazo de conexiones no autenticadas)
