import {
  EventType,
  InteractionRequiredAuthError,
  PublicClientApplication,
  type AccountInfo,
  type AuthenticationResult,
} from '@azure/msal-browser'

export const tenantId = import.meta.env.VITE_AZURE_TENANT_ID ?? 'common'
export const clientId = import.meta.env.VITE_AZURE_CLIENT_ID ?? ''
export const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI ?? window.location.origin
export const popupRedirectUri =
  import.meta.env.VITE_AZURE_POPUP_REDIRECT_URI ?? `${window.location.origin}/auth/callback`

export const loginRequest = {
  scopes: ['User.Read', 'OnlineMeetings.ReadWrite'],
  prompt: 'select_account',
  redirectUri: popupRedirectUri,
}

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: popupRedirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
})

export type MeetingData = {
  id: string
  subject: string
  joinWebUrl: string
  startDateTime: string
  endDateTime: string
}

export const trackedDebugEvents = new Set<string>([
  EventType.LOGIN_SUCCESS,
  EventType.ACQUIRE_TOKEN_SUCCESS,
  EventType.ACQUIRE_TOKEN_FAILURE,
  EventType.LOGOUT_SUCCESS,
  EventType.LOGOUT_FAILURE,
])

export function clearInteractionInProgressFlag(): void {
  const interactionStatusSuffix = '.interaction.status'
  const storages = [window.localStorage, window.sessionStorage]

  for (const storage of storages) {
    const keysToRemove: string[] = []

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)

      if (!key || !key.endsWith(interactionStatusSuffix)) {
        continue
      }

      keysToRemove.push(key)
    }

    for (const key of keysToRemove) {
      storage.removeItem(key)
    }
  }
}

export const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate))

export function resolveCurrentAccount(authResponse?: AuthenticationResult | null): AccountInfo | null {
  return authResponse?.account ?? msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0] ?? null
}

export async function getGraphToken(account: AccountInfo): Promise<string> {
  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    })

    return response.accessToken
  } catch (error) {
    if (!(error instanceof InteractionRequiredAuthError)) {
      throw error
    }

    const response = await msalInstance.acquireTokenPopup(loginRequest)

    if (!response.account) {
      throw new Error('No se pudo recuperar la cuenta tras renovar el token.')
    }

    msalInstance.setActiveAccount(response.account)

    return response.accessToken
  }
}

export async function createTeamsMeeting(accessToken: string): Promise<MeetingData> {
  const startDateTime = new Date()
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000)

  const response = await fetch('https://graph.microsoft.com/v1.0/me/onlineMeetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      subject: `Meet creada desde meet-link-teams - ${formatDate(startDateTime.toISOString())}`,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(
      `Microsoft Graph devolvio ${response.status}. Revisa que el registro tenga el permiso delegado OnlineMeetings.ReadWrite. ${details}`,
    )
  }

  return (await response.json()) as MeetingData
}

export { EventType }
export type { AccountInfo, AuthenticationResult }
