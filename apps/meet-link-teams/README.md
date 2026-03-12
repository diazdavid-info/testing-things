# meet-link-teams

Aplicacion React + Vite con `react-router-dom` que abre un popup de Azure AD con `@azure/msal-browser` y, tras autenticarse, crea una reunion de Microsoft Teams mediante Microsoft Graph.

## Configuracion

1. Copia `.env.example` a `.env`.
2. Rellena al menos estas variables:

```bash
VITE_AZURE_CLIENT_ID=tu-client-id
VITE_AZURE_TENANT_ID=common
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_AZURE_POPUP_REDIRECT_URI=http://localhost:5173/auth/callback
```

## Permisos necesarios en Azure

En el App Registration debes tener como minimo:

- `User.Read`
- `OnlineMeetings.ReadWrite` delegado

Despues, concede consentimiento si tu tenant lo requiere.

Tambien registra estas Redirect URIs en Azure:

- `http://localhost:5173`
- `http://localhost:5173/auth/callback`

## Arranque

```bash
pnpm dev
```

## Flujo

La app usa dos rutas:

- `/` para la home
- `/auth/callback` como callback React minimo del popup, encargado de ejecutar el bridge oficial de MSAL

La home muestra un boton que:

1. Lanza `loginPopup()` de MSAL.
2. Pide un token para Microsoft Graph.
3. Hace `POST /me/onlineMeetings`.
4. Muestra el `joinWebUrl` de Teams listo para abrir o copiar.

Mientras pruebas el flujo, la home tambien muestra un bloque `Debug MSAL` con los eventos principales y errores relevantes del login popup.
