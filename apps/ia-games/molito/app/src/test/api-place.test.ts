// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest'
import { POST as createGameAPI } from '../pages/api/games/index'
import { POST as joinGameAPI } from '../pages/api/games/[code]/join'
import { POST as placeAPI } from '../pages/api/games/[code]/place'
import { GET as stateAPI } from '../pages/api/games/[code]/state'
import { clearStore } from '../lib/game'

function ctx(params: Record<string, string> = {}) {
  return { params } as any
}

function placeCtx(code: string, body: object) {
  return {
    params: { code },
    request: new Request('http://localhost/api/games/' + code + '/place', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
  } as any
}

function stateCtx(code: string, playerId: string | null) {
  return {
    params: { code },
    cookies: {
      get: (name: string) => (name === `playerId_${code}` && playerId ? { value: playerId } : undefined),
    },
  } as any
}

async function createAndJoin() {
  const createRes = await createGameAPI(ctx())
  const createData = await createRes.json()
  const joinRes = await joinGameAPI(ctx({ code: createData.code }))
  const joinData = await joinRes.json()
  return {
    code: createData.code,
    player1Id: createData.playerId,
    player2Id: joinData.playerId,
  }
}

describe('POST /api/games/{code}/place', () => {
  beforeEach(() => clearStore())

  it('places a piece and returns updated board', async () => {
    const { code, player1Id } = await createAndJoin()
    const res = await placeAPI(placeCtx(code, { position: 0, playerId: player1Id }))
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.board[0]).toBe('player1')
    expect(data.turn).toBe('player2')
    expect(data.mill).toBe(false)
    expect(data.player1.piecesToPlace).toBe(8)
    expect(data.player1.piecesOnBoard).toBe(1)
  })

  it('returns 400 when placing out of turn', async () => {
    const { code, player2Id } = await createAndJoin()
    const res = await placeAPI(placeCtx(code, { position: 0, playerId: player2Id }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when position is occupied', async () => {
    const { code, player1Id, player2Id } = await createAndJoin()
    await placeAPI(placeCtx(code, { position: 0, playerId: player1Id }))
    const res = await placeAPI(placeCtx(code, { position: 0, playerId: player2Id }))
    expect(res.status).toBe(400)
  })

  it('returns 404 for non-existent code', async () => {
    const res = await placeAPI(placeCtx('ZZZZ', { position: 0, playerId: 'x' }))
    expect(res.status).toBe(404)
  })

  it('returns 409 for game not in playing state', async () => {
    const createRes = await createGameAPI(ctx())
    const { code, playerId } = await createRes.json()
    const res = await placeAPI(placeCtx(code, { position: 0, playerId }))
    expect(res.status).toBe(409)
  })

  it('returns 403 for unknown player', async () => {
    const { code } = await createAndJoin()
    const res = await placeAPI(placeCtx(code, { position: 0, playerId: 'unknown' }))
    expect(res.status).toBe(403)
  })

  it('alternates turns between players', async () => {
    const { code, player1Id, player2Id } = await createAndJoin()

    await placeAPI(placeCtx(code, { position: 0, playerId: player1Id }))
    const res2 = await placeAPI(placeCtx(code, { position: 3, playerId: player2Id }))
    expect(res2.status).toBe(200)
    const data2 = await res2.json()
    expect(data2.board[3]).toBe('player2')
    expect(data2.turn).toBe('player1')
  })
})

describe('GET /api/games/{code}/state', () => {
  beforeEach(() => clearStore())

  it('returns full game state for a player', async () => {
    const { code, player1Id } = await createAndJoin()
    const res = await stateAPI(stateCtx(code, player1Id))
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.board).toHaveLength(24)
    expect(data.turn).toBe('player1')
    expect(data.phase).toBe('place')
    expect(data.status).toBe('playing')
    expect(data.player1.piecesToPlace).toBe(9)
    expect(data.player2.piecesToPlace).toBe(9)
  })

  it('returns 404 for non-existent code', async () => {
    const res = await stateAPI(stateCtx('ZZZZ', null))
    expect(res.status).toBe(404)
  })

  it('returns 403 for non-player visitor', async () => {
    const { code } = await createAndJoin()
    const res = await stateAPI(stateCtx(code, 'stranger'))
    expect(res.status).toBe(403)
  })
})
