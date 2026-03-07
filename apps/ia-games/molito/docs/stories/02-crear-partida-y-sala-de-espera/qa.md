# Story 02 — Tareas de QA

> **Referencia rapida:**
> - Ruta: `/molino/{code}`
> - API: `POST /api/games`, `GET /api/games/{code}/status`
> - Store en memoria: `src/lib/game.ts`
> - Disenos Pencil: pantallas de sala de espera en `molino.pen`

---

## QA-DEV-01: Verificar modelo de datos

- Crear una partida via API y verificar que el modelo tiene todos los campos:
  - `id`, `code`, `status: "waiting"`, `player1` con `piecesToPlace: 9`, `board` con 24 nulls
- El `code` tiene exactamente 4 caracteres alfanumericos
- No se generan codigos duplicados (crear varias partidas y verificar)

## QA-DEV-02: Verificar API de creacion de partida

- `POST /api/games` devuelve 200 con `{ id, code, playerId }`
- La partida queda en el store con status `waiting`
- El `playerId` corresponde al player1 de la partida
- Llamar multiples veces genera partidas distintas con codigos distintos

## QA-DEV-03: Verificar pagina de sala de espera

- Crear una partida y navegar a `/molino/{code}` → se ve la sala de espera
- Navegar a `/molino/ZZZZ` (codigo inexistente) → se ve "Partida no encontrada" con link al inicio
- La pagina muestra el codigo de partida de forma destacada

## QA-DEV-04: Verificar componente sala de espera

- El codigo de partida se muestra en pantalla, grande y legible
- "Copiar link" copia la URL completa al portapapeles (verificar con `Ctrl+V` / `Cmd+V`)
- "Copiar codigo" copia solo el codigo al portapapeles
- Tras copiar, el boton muestra "Copiado!" durante ~2 segundos y luego vuelve al original
- Se muestra "Esperando jugador..." con animacion
- "Volver al inicio" lleva a `/`

## QA-DEV-05: Verificar polling y deteccion de rival

- Crear una partida y quedarse en la sala de espera
- Desde otra pestana, unirse a la partida
- Verificar que la sala de espera detecta el cambio y redirige al tablero
- Verificar que el polling para despues de la redireccion
- Verificar en Network/DevTools que el polling ocurre cada ~3 segundos

## QA-DEV-06: Verificar API de estado

- `GET /api/games/{code}/status` con partida en `waiting` → `{ status: "waiting", playerCount: 1 }`
- Tras unirse un segundo jugador → `{ status: "playing", playerCount: 2 }`
- Con codigo inexistente → 404

---

## QA-UX-01: Verificar diseno sala de espera — Desktop

- Comparar con el mockup de Pencil
- El codigo es el elemento con mayor peso visual
- Los botones de copiar son claramente accionables
- El indicador "Esperando jugador..." tiene animacion sutil
- El layout esta centrado y es coherente con la pantalla de inicio

## QA-UX-02: Verificar diseno sala de espera — Mobile

- Comparar con mockup movil en Pencil
- Los botones de copiar se apilan y ocupan ancho completo
- El codigo sigue siendo prominente
- No hay scroll horizontal, nada se corta

## QA-UX-03: Verificar feedback "Copiado!"

- Al copiar, el boton cambia a "Copiado!" (con icono check si aplica)
- El cambio es visible y claro
- Vuelve al texto original tras ~2 segundos
- Funciona correctamente en ambos botones

## QA-UX-04: Verificar pantalla de partida no encontrada

- Acceder a un codigo invalido muestra mensaje de error claro
- Hay boton "Volver al inicio" funcional
- El diseno es coherente con el resto de la app

## QA-UX-05: Verificar transicion de espera a juego

- Cuando el rival se une, el indicador cambia brevemente antes de redirigir
- La transicion no es brusca ni confusa

---

## QA-SEO-01: Verificar metadatos de la sala de espera

- `<title>` contiene el codigo de la partida
- `<meta name="description">` invita a unirse
- Verificar que al compartir `/molino/ABCD` en WhatsApp/Telegram se muestra preview atractivo

## QA-SEO-02: Verificar Open Graph del link compartido

- `og:title` contiene mensaje de reto/invitacion
- `og:description` invita a abrir el link
- Verificar con Facebook Sharing Debugger (cuando haya dominio)

## QA-MKT-01: Verificar copywriting

- Titulo: "Tu partida esta lista"
- Botones: "Copiar link", "Copiar codigo"
- Feedback: "Copiado!"
- Indicador: "Esperando jugador..."
- Link: "Volver al inicio"
- Textos directos, sin errores ortograficos

## QA-MKT-02: Verificar eventos de analytics

- Verificar que los eventos estan documentados en `analytics-events.ts`
- Verificar que `trackEvent()` se puede llamar sin errores
- No hay scripts de analytics cargados aun
