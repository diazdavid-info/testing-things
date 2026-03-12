import type { AccountInfo } from '@azure/msal-browser'
import { clientId, formatDate, popupRedirectUri, redirectUri, tenantId, type MeetingData } from '../lib/msal.ts'

type HomePageProps = {
  account: AccountInfo | null
  debugMessages: string[]
  errorMessage: string | null
  isLoading: boolean
  isReady: boolean
  meeting: MeetingData | null
  onCreateMeeting: () => Promise<void>
  onLogout: () => Promise<void>
}

function HomePage({
  account,
  debugMessages,
  errorMessage,
  isLoading,
  isReady,
  meeting,
  onCreateMeeting,
  onLogout,
}: HomePageProps) {
  return (
    <main className="shell">
      <section className="hero-card">
        <p className="eyebrow">Azure AD + Microsoft Graph</p>
        <h1>Crea un link de Teams desde un popup de login.</h1>
        <p className="lead">
          Pulsa el boton, autentica con tu cuenta de Microsoft y generaremos una reunion de Teams de 30 minutos
          devolviendo su enlace listo para compartir.
        </p>

        <div className="actions">
          <button
            className="primary-button"
            disabled={isLoading || !isReady}
            onClick={() => void onCreateMeeting()}
            type="button"
          >
            {isLoading ? 'Creando reunion...' : 'Login con Azure y crear meet'}
          </button>

          <button
            className="secondary-button"
            disabled={!account || isLoading}
            onClick={() => void onLogout()}
            type="button"
          >
            Cerrar sesion
          </button>
        </div>

        <dl className="status-grid">
          <div>
            <dt>Cuenta activa</dt>
            <dd>{account?.username ?? 'Sin iniciar sesion'}</dd>
          </div>
          <div>
            <dt>Tenant</dt>
            <dd>{tenantId}</dd>
          </div>
          <div>
            <dt>Redirect URI</dt>
            <dd>{redirectUri}</dd>
          </div>
          <div>
            <dt>Popup redirect</dt>
            <dd>{popupRedirectUri}</dd>
          </div>
        </dl>

        {!clientId && (
          <div className="notice warning">
            Configura <code>VITE_AZURE_CLIENT_ID</code> antes de probar el login.
          </div>
        )}

        {errorMessage && <div className="notice error">{errorMessage}</div>}

        {debugMessages.length > 0 && (
          <div className="notice debug">
            <strong>Debug MSAL</strong>
            <div className="debug-list">
              {debugMessages.map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          </div>
        )}

        {meeting && (
          <article className="meeting-card">
            <div className="meeting-card__header">
              <p className="meeting-card__label">Reunion creada</p>
              <h2>{meeting.subject}</h2>
            </div>

            <p className="meeting-card__time">
              {formatDate(meeting.startDateTime)} - {formatDate(meeting.endDateTime)}
            </p>

            <a className="meeting-link" href={meeting.joinWebUrl} rel="noreferrer" target="_blank">
              {meeting.joinWebUrl}
            </a>

            <div className="actions">
              <a className="link-button" href={meeting.joinWebUrl} rel="noreferrer" target="_blank">
                Abrir Teams
              </a>
              <button
                className="ghost-button"
                onClick={() => void navigator.clipboard.writeText(meeting.joinWebUrl)}
                type="button"
              >
                Copiar enlace
              </button>
            </div>
          </article>
        )}
      </section>
    </main>
  )
}

export default HomePage
