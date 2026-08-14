import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

import type { AstroCookies } from 'astro'
import { SESSION_SECRET } from 'astro:env/server'

interface OAuthCredentials {
  access_token?: string | null
  expiry_date?: number | null
  id_token?: string | null
  refresh_token?: string | null
  scope?: string
  token_type?: string | null
}

export interface SessionData {
  tokens: OAuthCredentials
  user: {
    email: string
    name: string
    picture?: string
  }
}

const SESSION_COOKIE = 'calendar_session'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

function encryptionKey(): Buffer {
  return createHash('sha256').update(SESSION_SECRET).digest()
}

function encrypt(value: SessionData): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  return Buffer.concat([iv, tag, encrypted]).toString('base64url')
}

function decrypt(value: string): SessionData | null {
  try {
    const data = Buffer.from(value, 'base64url')
    const iv = data.subarray(0, 12)
    const tag = data.subarray(12, 28)
    const encrypted = data.subarray(28)
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv)
    decipher.setAuthTag(tag)

    return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')) as SessionData
  } catch {
    return null
  }
}

export function readSession(cookies: AstroCookies): SessionData | null {
  const value = cookies.get(SESSION_COOKIE)?.value
  return value ? decrypt(value) : null
}

export function writeSession(cookies: AstroCookies, session: SessionData): void {
  cookies.set(SESSION_COOKIE, encrypt(session), {
    httpOnly: true,
    maxAge: MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  })
}

export function clearSession(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' })
}
