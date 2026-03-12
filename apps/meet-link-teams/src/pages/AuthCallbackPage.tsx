import { useEffect, useState } from 'react'
import { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge'

function AuthCallbackPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    void broadcastResponseToMainFrame().catch((error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo completar el callback de Azure.')
    })
  }, [])

  return (
    <main className="callback-shell">
      <p>{errorMessage ?? 'Completando autenticacion de Azure...'}</p>
    </main>
  )
}

export default AuthCallbackPage
