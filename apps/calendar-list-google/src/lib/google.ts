import type { AstroCookies } from 'astro'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from 'astro:env/server'
import { google } from 'googleapis'

import { readSession, writeSession } from './session.ts'

export const GOOGLE_SCOPES = ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar']

export function createOAuthClient() {
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
}

export function authenticatedCalendar(cookies: AstroCookies) {
  const session = readSession(cookies)
  if (!session) return null

  const auth = createOAuthClient()
  auth.setCredentials(session.tokens)
  auth.on('tokens', (tokens) => {
    session.tokens = { ...session.tokens, ...tokens }
    writeSession(cookies, session)
  })

  return google.calendar({ version: 'v3', auth })
}
