import { randomBytes } from 'node:crypto'

import type { APIRoute } from 'astro'

import { createOAuthClient, GOOGLE_SCOPES } from '../../../lib/google.ts'

export const GET: APIRoute = ({ cookies, redirect }) => {
  const state = randomBytes(24).toString('base64url')
  cookies.set('oauth_state', state, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: '/',
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  })

  const authorizationUrl = createOAuthClient().generateAuthUrl({
    access_type: 'offline',
    include_granted_scopes: true,
    prompt: 'consent',
    scope: GOOGLE_SCOPES,
    state,
  })

  return redirect(authorizationUrl)
}
