import type { APIRoute } from 'astro'

import { createOAuthClient } from '../../../lib/google.ts'
import { writeSession } from '../../../lib/session.ts'

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')
  const storedState = cookies.get('oauth_state')?.value
  cookies.delete('oauth_state', { path: '/' })

  if (!code || !returnedState || !storedState || returnedState !== storedState) {
    return redirect('/?auth_error=invalid_state')
  }

  try {
    const auth = createOAuthClient()
    const { tokens } = await auth.getToken(code)
    auth.setCredentials(tokens)
    const { data: user } = await auth.request<{
      email: string
      name: string
      picture?: string
    }>({ url: 'https://openidconnect.googleapis.com/v1/userinfo' })

    writeSession(cookies, {
      tokens,
      user: { email: user.email, name: user.name, picture: user.picture },
    })

    return redirect('/')
  } catch (error) {
    console.error('Google OAuth callback failed', error)
    return redirect('/?auth_error=oauth_failed')
  }
}
