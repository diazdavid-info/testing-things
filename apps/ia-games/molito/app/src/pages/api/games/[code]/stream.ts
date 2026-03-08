import type { APIRoute } from 'astro'
import { getGameByCode } from '../../../../lib/game'
import { subscribe, notify } from '../../../../lib/game-events'
import type { Game, PlayerKey } from '../../../../lib/game'

const GRACE_PERIOD_MS = 15_000

function isConnected(game: Game, playerKey: PlayerKey): boolean {
  const ts = game.lastSeen[playerKey]
  if (ts === null) return false
  return Date.now() - ts < GRACE_PERIOD_MS
}

function gameToState(game: Game) {
  return {
    board: game.board,
    turn: game.turn,
    phase: game.phase,
    turnState: game.turnState,
    status: game.status,
    winner: game.winner,
    winReason: game.winReason,
    player1: { piecesToPlace: game.player1.piecesToPlace, piecesOnBoard: game.player1.piecesOnBoard },
    player2: game.player2
      ? { piecesToPlace: game.player2.piecesToPlace, piecesOnBoard: game.player2.piecesOnBoard }
      : null,
    connected: {
      player1: isConnected(game, 'player1'),
      player2: isConnected(game, 'player2'),
    },
    rematchRequested: game.rematchRequested,
    rematchGameCode: game.rematchGameCode,
  }
}

export const GET: APIRoute = async ({ params, request }) => {
  const code = params.code!
  const game = getGameByCode(code)

  if (!game) {
    return new Response('Game not found', { status: 404 })
  }

  // Determine which player is connecting via query param
  const url = new URL(request.url)
  const playerId = url.searchParams.get('playerId')
  let playerKey: PlayerKey | null = null
  if (playerId && game.player1.id === playerId) playerKey = 'player1'
  else if (playerId && game.player2?.id === playerId) playerKey = 'player2'

  // Reject unauthenticated connections
  if (!playerKey) {
    return new Response('Forbidden', { status: 403 })
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      function send(data: string) {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch {
          // Stream closed
        }
      }

      // Mark player as connected
      if (playerKey) {
        game.lastSeen[playerKey] = Date.now()
        notify(code)
      }

      // Send initial state
      send(JSON.stringify(gameToState(game)))

      // Subscribe to updates
      const unsubscribe = subscribe(code, (updatedGame) => {
        send(JSON.stringify(gameToState(updatedGame)))
      })

      // Update lastSeen periodically and heartbeat
      const heartbeat = setInterval(() => {
        try {
          if (playerKey) {
            game.lastSeen[playerKey] = Date.now()
          }
          controller.enqueue(encoder.encode(': heartbeat\n\n'))
        } catch {
          clearInterval(heartbeat)
        }
      }, 10_000)

      // Cleanup when client disconnects
      const checkClosed = setInterval(() => {
        try {
          controller.enqueue(new Uint8Array(0))
        } catch {
          clearInterval(checkClosed)
          clearInterval(heartbeat)
          unsubscribe()
          // Notify others that this player disconnected
          if (playerKey) {
            notify(code)
          }
        }
      }, 5_000)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
