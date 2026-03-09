import { getGameByCode } from './game'
import type { Game, PlayerKey } from './game'

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

export function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: SECURITY_HEADERS,
  })
}

export function setCookieHeader(code: string, playerId: string): string {
  return `playerId_${code}=${playerId}; Path=/molino/${code}; HttpOnly; SameSite=Strict; Max-Age=86400`
}

export async function parseJsonBody<T = Record<string, unknown>>(request: Request): Promise<T | Response> {
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 1024) {
    return json({ error: 'Payload demasiado grande' }, 413)
  }
  try {
    return await request.json()
  } catch {
    return json({ error: 'Body invalido' }, 400)
  }
}

export function validatePosition(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 23
}

export function validatePlayerId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 100
}

export function requireGame(code: string): Game | Response {
  const game = getGameByCode(code)
  if (!game) return json({ error: 'Partida no encontrada' }, 404)
  return game
}

export function resolvePlayer(game: Game, playerId: string): PlayerKey | null {
  if (game.player1.id === playerId) return 'player1'
  if (game.player2?.id === playerId) return 'player2'
  return null
}

export function requirePlayer(game: Game, playerId: string): PlayerKey | Response {
  const key = resolvePlayer(game, playerId)
  if (!key) return json({ error: 'No eres jugador de esta partida' }, 403)
  return key
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response
}
