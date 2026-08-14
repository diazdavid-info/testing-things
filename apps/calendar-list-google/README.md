# Renglón

Cliente de Google Calendar en formato lista, construido con Astro. Permite cambiar de calendario, seleccionar
varios eventos y borrar ocurrencias individuales, incluso cuando pertenecen a una serie recurrente.

## Configuración

1. Crea un proyecto en Google Cloud y activa **Google Calendar API**.
2. Configura la pantalla de consentimiento OAuth.
3. Crea credenciales OAuth de tipo **Aplicación web**.
4. Añade `http://localhost:4321/api/auth/callback` a los URI de redirección autorizados.
5. Copia `.env.example` a `.env` y completa las credenciales.

```bash
pnpm install
pnpm --filter calendar-list-google dev
```

La app solicita los scopes `openid`, `email`, `profile` y `calendar`. Los tokens se guardan cifrados en una cookie
`HttpOnly`. En producción, usa HTTPS, cambia `GOOGLE_REDIRECT_URI` y genera un `SESSION_SECRET` exclusivo.
