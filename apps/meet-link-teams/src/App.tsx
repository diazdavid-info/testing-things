import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import AuthCallbackPage from './pages/AuthCallbackPage.tsx'
import {
  EventType,
  clearInteractionInProgressFlag,
  createTeamsMeeting,
  getGraphToken,
  loginRequest,
  msalInstance,
  redirectUri,
  resolveCurrentAccount,
  trackedDebugEvents,
  type AccountInfo,
  type AuthenticationResult,
  type MeetingData,
} from './lib/msal.ts'

function App() {
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [meeting, setMeeting] = useState<MeetingData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [debugMessages, setDebugMessages] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true

    const pushDebugMessage = (message: string): void => {
      if (!isMounted) {
        return
      }

      setDebugMessages((currentMessages) =>
        [`${new Date().toLocaleTimeString('es-ES')} - ${message}`, ...currentMessages].slice(0, 8),
      )
    }

    const callbackId = msalInstance.addEventCallback((event) => {
      if (trackedDebugEvents.has(event.eventType)) {
        pushDebugMessage(`MSAL event: ${event.eventType}`)
      }

      if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
        const result = event.payload as AuthenticationResult | null
        const nextAccount = resolveCurrentAccount(result)

        if (nextAccount) {
          msalInstance.setActiveAccount(nextAccount)
        }

        if (isMounted) {
          setAccount(nextAccount)
          setIsLoading(false)
          setErrorMessage(null)
          setIsReady(true)
          pushDebugMessage(`Cuenta activa detectada: ${nextAccount?.username ?? 'ninguna'}`)
        }
      }
    })

    const setupMsal = async (): Promise<void> => {
      try {
        await msalInstance.initialize()
        pushDebugMessage('MSAL inicializado')

        const currentAccount = resolveCurrentAccount()

        if (currentAccount) {
          msalInstance.setActiveAccount(currentAccount)
        }

        if (isMounted) {
          setAccount(currentAccount)
          setIsReady(true)
          pushDebugMessage(`Cuentas en cache al iniciar: ${msalInstance.getAllAccounts().length}`)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'No se pudo inicializar MSAL.')
          setIsReady(true)
          pushDebugMessage(
            error instanceof Error ? `Error al inicializar: ${error.message}` : 'Error al inicializar MSAL',
          )
        }
      }
    }

    void setupMsal()

    return () => {
      isMounted = false
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId)
      }
    }
  }, [])

  const handleCreateMeeting = async (): Promise<void> => {
    if (!isReady || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setMeeting(null)

    const pushActionDebugMessage = (message: string): void => {
      setDebugMessages((currentMessages) =>
        [`${new Date().toLocaleTimeString('es-ES')} - ${message}`, ...currentMessages].slice(0, 8),
      )
    }

    try {
      setDebugMessages([])
      let authResponse: AuthenticationResult | null = null
      let currentAccount = account

      if (!currentAccount) {
        pushActionDebugMessage('Lanzando loginPopup()')

        try {
          authResponse = await msalInstance.loginPopup(loginRequest)
        } catch (error) {
          if (!(error instanceof Error) || !error.message.includes('interaction_in_progress')) {
            throw error
          }

          clearInteractionInProgressFlag()
          pushActionDebugMessage('Flag interaction_in_progress limpiada, reintentando popup')
          authResponse = await msalInstance.loginPopup(loginRequest)
        }

        currentAccount = resolveCurrentAccount(authResponse)
        pushActionDebugMessage(`loginPopup resuelto. Cuenta devuelta: ${currentAccount?.username ?? 'ninguna'}`)

        if (!currentAccount) {
          throw new Error('Azure no devolvio una cuenta valida despues del login.')
        }

        msalInstance.setActiveAccount(currentAccount)
        setAccount(currentAccount)
      }

      const accessToken = authResponse?.accessToken ?? (await getGraphToken(currentAccount))
      pushActionDebugMessage('Token obtenido, creando reunion en Graph')
      const createdMeeting = await createTeamsMeeting(accessToken)
      setMeeting(createdMeeting)
      pushActionDebugMessage('Reunion creada correctamente')
    } catch (error) {
      setMeeting(null)
      setErrorMessage(error instanceof Error ? error.message : 'Ha ocurrido un error creando la reunion de Teams.')
      pushActionDebugMessage(`Error: ${error instanceof Error ? error.message : 'error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async (): Promise<void> => {
    const activeAccount = msalInstance.getActiveAccount() ?? account

    if (!activeAccount) {
      setAccount(null)
      setMeeting(null)
      return
    }

    await msalInstance.logoutPopup({
      account: activeAccount,
      postLogoutRedirectUri: redirectUri,
    })

    setAccount(null)
    setMeeting(null)
    setErrorMessage(null)
  }

  return (
    <Routes>
      <Route
        element={
          <HomePage
            account={account}
            debugMessages={debugMessages}
            errorMessage={errorMessage}
            isLoading={isLoading}
            isReady={isReady}
            meeting={meeting}
            onCreateMeeting={handleCreateMeeting}
            onLogout={handleLogout}
          />
        }
        path="/"
      />
      <Route element={<AuthCallbackPage />} path="/auth/callback" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

export default App
