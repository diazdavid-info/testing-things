import type { APIRoute } from 'astro'
import { getGameByCode } from '../../../../lib/game'
import { json } from '../../../../lib/api-helpers'

export const GET: APIRoute = async ({ params }) => {
  const code = params.code!
  const game = getGameByCode(code)

  if (!game) {
    return json({ error: 'Partida no encontrada' }, 404)
  }

  return json(
    {
      status: game.status,
      playerCount: game.player2 ? 2 : 1,
    },
    200,
  )
}
