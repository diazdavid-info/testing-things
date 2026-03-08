import type { APIRoute } from 'astro'
import type { PlayerKey } from '../../../../lib/game'
import { notify } from '../../../../lib/game-events'
import {
  json,
  parseJsonBody,
  requireGame,
  requirePlayer,
  isResponse,
  validatePlayerId,
} from '../../../../lib/api-helpers'

const ABANDON_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export const POST: APIRoute = async ({ params, request }) => {
  const game = requireGame(params.code!)
  if (isResponse(game)) return game

  if (game.status !== 'playing') {
    return json({ error: 'La partida no esta en curso' }, 409)
  }

  const body = await parseJsonBody<{ playerId?: string }>(request)
  if (isResponse(body)) return body

  const { playerId } = body
  if (!validatePlayerId(playerId)) {
    return json({ error: 'Parametros invalidos' }, 400)
  }

  const playerKey = requirePlayer(game, playerId)
  if (isResponse(playerKey)) return playerKey

  const rivalKey: PlayerKey = playerKey === 'player1' ? 'player2' : 'player1'
  const rivalLastSeen = game.lastSeen[rivalKey]

  if (rivalLastSeen !== null && Date.now() - rivalLastSeen < ABANDON_TIMEOUT_MS) {
    return json({ error: 'Tu rival aun esta conectado' }, 400)
  }

  game.status = 'finished'
  game.winner = playerKey
  game.winReason = 'abandon'

  notify(params.code!)

  return json(
    {
      status: game.status,
      winner: game.winner,
      winReason: game.winReason,
    },
    200,
  )
}
