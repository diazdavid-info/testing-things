// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest'
import { POST as removeAPI } from '../pages/api/games/[code]/remove'
import { clearStore, createGame, joinGame, getGameByCode } from '../lib/game'

function removeCtx(code: string, body: object) {
  return {
    params: { code },
    request: new Request('http://localhost/api/games/' + code + '/remove', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
  } as any
}

function setupRemoveState() {
  const game = createGame()
  const join = joinGame(game.code)!
  // Player1 forms mill at [0,1,2], player2 has piece at 9
  game.board[0] = 'player1'
  game.board[1] = 'player1'
  game.board[2] = 'player1'
  game.board[9] = 'player2'
  game.player1.piecesOnBoard = 3
  game.player1.piecesToPlace = 6
  game.player2!.piecesOnBoard = 1
  game.player2!.piecesToPlace = 8
  game.turnState = 'remove'
  game.turn = 'player1'
  return { code: game.code, player1Id: game.player1.id, player2Id: join.playerId }
}

describe('POST /api/games/{code}/remove', () => {
  beforeEach(() => clearStore())

  it('removes a rival piece and returns 200', async () => {
    const { code, player1Id } = setupRemoveState()
    const res = await removeAPI(removeCtx(code, { position: 9, playerId: player1Id }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.board[9]).toBeNull()
    expect(data.turn).toBe('player2')
    expect(data.turnState).toBe('place')
  })

  it('returns 400 when trying to remove own piece', async () => {
    const { code, player1Id } = setupRemoveState()
    const res = await removeAPI(removeCtx(code, { position: 0, playerId: player1Id }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Solo puedes eliminar')
  })

  it('returns 400 when trying to remove piece in mill', async () => {
    const { code, player1Id } = setupRemoveState()
    const game = getGameByCode(code)!
    // Add a mill for player2 at [3,4,5] and a free piece at 9
    game.board[3] = 'player2'
    game.board[4] = 'player2'
    game.board[5] = 'player2'
    game.player2!.piecesOnBoard = 4

    const res = await removeAPI(removeCtx(code, { position: 3, playerId: player1Id }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('molino')
  })

  it('returns 409 when turnState is not remove', async () => {
    const game = createGame()
    joinGame(game.code)
    const res = await removeAPI(removeCtx(game.code, { position: 0, playerId: game.player1.id }))
    expect(res.status).toBe(409)
  })

  it('returns 404 for non-existent game', async () => {
    const res = await removeAPI(removeCtx('ZZZZ', { position: 0, playerId: 'x' }))
    expect(res.status).toBe(404)
  })

  it('returns winner when rival drops below 3 pieces', async () => {
    const { code, player1Id } = setupRemoveState()
    const game = getGameByCode(code)!
    // Player2 has exactly 3 pieces, no pieces to place
    game.board[9] = 'player2'
    game.board[10] = 'player2'
    game.board[11] = 'player2'
    game.player2!.piecesOnBoard = 3
    game.player2!.piecesToPlace = 0

    const res = await removeAPI(removeCtx(code, { position: 9, playerId: player1Id }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('finished')
    expect(data.winner).toBe('player1')
  })
})
