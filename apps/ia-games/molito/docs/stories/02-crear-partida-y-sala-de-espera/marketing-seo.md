# Story 02 — Tareas de marketing y SEO

## SEO-01: Metadatos de la pagina de sala de espera

- `<title>`: "Partida {code} — El Molino"
- `<meta name="description">`: "Unete a la partida {code} del Molino. Abre este link para jugar."
- Estos metadatos son importantes porque el link se comparte directamente

## SEO-02: Open Graph para el link compartido

- Cuando alguien comparte el link `https://domain/molino/ABCD`, el preview debe invitar a unirse
- `og:title`: "Te han retado a jugar al Molino!"
- `og:description`: "Abre este link para unirte a la partida y empezar a jugar"
- `og:image`: reutilizar la imagen de preview social (de Story 01, SEO-03)
- Estos metadatos son criticos porque el link de la sala es lo que se comparte por WhatsApp, Telegram, etc.

## MKT-01: Copywriting de la sala de espera

- Titulo: "Tu partida esta lista"
- Codigo: mostrado grande y claro
- Boton copiar link: "Copiar link"
- Boton copiar codigo: "Copiar codigo"
- Feedback copiar: "Copiado!"
- Indicador espera: "Esperando jugador..."
- Indicador conexion: "Jugador conectado!"
- Subtexto opcional: "Comparte el codigo o el link con tu rival"
- Link secundario: "Volver al inicio"

## MKT-02: Eventos de analytics

- Nuevos eventos a documentar:
  - `waiting_room_view` — el jugador ve la sala de espera
  - `copy_link` — pulsa "Copiar link"
  - `copy_code` — pulsa "Copiar codigo"
  - `opponent_joined` — el rival se une (polling detecta cambio)
  - `waiting_room_exit` — el jugador vuelve al inicio sin que se una nadie
