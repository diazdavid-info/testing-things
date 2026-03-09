import type { APIRoute } from 'astro'
import { getGameByCode, joinGame } from '../../../../lib/game'
import { notify } from '../../../../lib/game-events'
import { json, setCookieHeader } from '../../../../lib/api-helpers'

export const POST: APIRoute = async ({ params }) => {
  const code = params.code!
  const game = getGameByCode(code)

  if (!game) {
    return json({ error: 'Codigo no encontrado' }, 404)
  }

  if (game.status === 'finished') {
    return json({ error: 'Esta partida ya ha terminado' }, 410)
  }

  if (game.status === 'playing') {
    return json({ error: 'Partida llena' }, 409)
  }

  const result = joinGame(code)
  if (!result) {
    return json({ error: 'Error al unirse' }, 500)
  }

  notify(code)

  return new Response(
    JSON.stringify({
      id: result.game.id,
      code: result.game.code,
      playerId: result.playerId,
      status: result.game.status,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'Set-Cookie': setCookieHeader(code, result.playerId),
      },
    },
  )
}
