import { describe, it, expect } from 'vitest'
import {
  createInitialState,
  applyAttack,
  isValidAttack,
  getValidAttackTargets,
  getValidSplits,
  applySplit,
  checkWinner,
  isHandAlive,
  getAliveHands,
  isPlayerEliminated,
  getOpponent,
  type GameState,
} from '../lib/game-engine'

describe('createInitialState', () => {
  it('creates state with [1,1] for both players', () => {
    const state = createInitialState()
    expect(state.player1).toEqual({ left: 1, right: 1 })
    expect(state.player2).toEqual({ left: 1, right: 1 })
  })

  it('starts with player1 turn', () => {
    const state = createInitialState()
    expect(state.currentTurn).toBe('player1')
  })

  it('starts in playing status with no winner', () => {
    const state = createInitialState()
    expect(state.status).toBe('playing')
    expect(state.winner).toBeNull()
  })
})

describe('isHandAlive', () => {
  it('returns false for 0', () => expect(isHandAlive(0)).toBe(false))
  it('returns true for 1', () => expect(isHandAlive(1)).toBe(true))
  it('returns true for 4', () => expect(isHandAlive(4)).toBe(true))
})

describe('getAliveHands', () => {
  it('returns both for [3, 2]', () => {
    expect(getAliveHands({ left: 3, right: 2 })).toEqual(['left', 'right'])
  })
  it('returns only left for [3, 0]', () => {
    expect(getAliveHands({ left: 3, right: 0 })).toEqual(['left'])
  })
  it('returns empty for [0, 0]', () => {
    expect(getAliveHands({ left: 0, right: 0 })).toEqual([])
  })
})

describe('isPlayerEliminated', () => {
  it('returns true for [0, 0]', () => {
    expect(isPlayerEliminated({ left: 0, right: 0 })).toBe(true)
  })
  it('returns false for [1, 0]', () => {
    expect(isPlayerEliminated({ left: 1, right: 0 })).toBe(false)
  })
})

describe('getOpponent', () => {
  it('player1 → player2', () => expect(getOpponent('player1')).toBe('player2'))
  it('player2 → player1', () => expect(getOpponent('player2')).toBe('player1'))
})

describe('isValidAttack', () => {
  it('valid attack with both hands alive', () => {
    const state = createInitialState()
    expect(isValidAttack(state, 'left', 'left')).toBe(true)
  })

  it('invalid: source hand dead', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 0, right: 2 },
    }
    expect(isValidAttack(state, 'left', 'left')).toBe(false)
  })

  it('invalid: target hand dead', () => {
    const state: GameState = {
      ...createInitialState(),
      player2: { left: 0, right: 3 },
    }
    expect(isValidAttack(state, 'left', 'left')).toBe(false)
  })

  it('invalid: game finished', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'finished',
    }
    expect(isValidAttack(state, 'left', 'left')).toBe(false)
  })
})

describe('getValidAttackTargets', () => {
  it('returns both alive hands', () => {
    const state = createInitialState()
    expect(getValidAttackTargets(state, 'left')).toEqual(['left', 'right'])
  })

  it('excludes dead hands', () => {
    const state: GameState = {
      ...createInitialState(),
      player2: { left: 0, right: 3 },
    }
    expect(getValidAttackTargets(state, 'left')).toEqual(['right'])
  })

  it('returns empty if source hand is dead', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 0, right: 2 },
    }
    expect(getValidAttackTargets(state, 'left')).toEqual([])
  })
})

describe('applyAttack', () => {
  it('basic attack: adds values', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 2, right: 1 },
      player2: { left: 1, right: 3 },
    }
    const next = applyAttack(state, 'left', 'right')
    expect(next.player2.right).toBe(0) // 3 + 2 = 5 → eliminated
  })

  it('attack without elimination', () => {
    const state = createInitialState()
    const next = applyAttack(state, 'left', 'left')
    expect(next.player2.left).toBe(2) // 1 + 1 = 2
  })

  it('eliminates hand at exactly 5', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 2, right: 1 },
      player2: { left: 3, right: 1 },
    }
    const next = applyAttack(state, 'left', 'left')
    expect(next.player2.left).toBe(0) // 3 + 2 = 5 → 0
  })

  it('eliminates hand above 5', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 4, right: 1 },
      player2: { left: 2, right: 1 },
    }
    const next = applyAttack(state, 'left', 'left')
    expect(next.player2.left).toBe(0) // 2 + 4 = 6 → 0
  })

  it('attacker hand does not change', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 3, right: 1 },
    }
    const next = applyAttack(state, 'left', 'left')
    expect(next.player1.left).toBe(3)
  })

  it('changes turn after attack', () => {
    const state = createInitialState()
    const next = applyAttack(state, 'left', 'left')
    expect(next.currentTurn).toBe('player2')
  })

  it('does not change state for invalid attack', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 0, right: 2 },
    }
    const next = applyAttack(state, 'left', 'left')
    expect(next).toBe(state)
  })

  it('detects victory when both hands eliminated', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 3, right: 1 },
      player2: { left: 0, right: 2 },
    }
    const next = applyAttack(state, 'left', 'right')
    expect(next.player2.right).toBe(0)
    expect(next.status).toBe('finished')
    expect(next.winner).toBe('player1')
  })
})

describe('getValidSplits', () => {
  it('[3, 1] total 4: excludes current state', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 3, right: 1 },
    }
    const splits = getValidSplits(state)
    expect(splits).not.toContainEqual([3, 1])
    expect(splits).toContainEqual([2, 2])
    expect(splits).toContainEqual([1, 3])
    expect(splits).toContainEqual([4, 0])
    expect(splits).toContainEqual([0, 4])
  })

  it('[4, 0] total 4: can revive', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 4, right: 0 },
    }
    const splits = getValidSplits(state)
    expect(splits).toContainEqual([2, 2])
    expect(splits).toContainEqual([3, 1])
    expect(splits).toContainEqual([1, 3])
    expect(splits).toContainEqual([0, 4])
    expect(splits).not.toContainEqual([4, 0])
  })

  it('[4, 1] total 5: has valid splits (2,3), (3,2), (1,4)', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 4, right: 1 },
    }
    const splits = getValidSplits(state)
    expect(splits).toContainEqual([1, 4])
    expect(splits).toContainEqual([2, 3])
    expect(splits).toContainEqual([3, 2])
    expect(splits).not.toContainEqual([4, 1]) // same as current
    expect(splits).not.toContainEqual([0, 5]) // exceeds 4
    expect(splits).not.toContainEqual([5, 0]) // exceeds 4
  })

  it('[1, 1] total 2: has valid splits', () => {
    const state = createInitialState()
    const splits = getValidSplits(state)
    expect(splits).toContainEqual([2, 0])
    expect(splits).toContainEqual([0, 2])
    expect(splits).not.toContainEqual([1, 1])
  })

  it('[2, 2] total 4: excludes current', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 2, right: 2 },
    }
    const splits = getValidSplits(state)
    expect(splits).not.toContainEqual([2, 2])
    expect(splits).toContainEqual([3, 1])
    expect(splits).toContainEqual([1, 3])
  })
})

describe('applySplit', () => {
  it('basic split updates hands', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 3, right: 1 },
    }
    const next = applySplit(state, [2, 2])
    expect(next.player1).toEqual({ left: 2, right: 2 })
  })

  it('revival: [4, 0] → [2, 2]', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 4, right: 0 },
    }
    const next = applySplit(state, [2, 2])
    expect(next.player1).toEqual({ left: 2, right: 2 })
  })

  it('changes turn after split', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 3, right: 1 },
    }
    const next = applySplit(state, [2, 2])
    expect(next.currentTurn).toBe('player2')
  })

  it('invalid split returns same state', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 3, right: 1 },
    }
    const next = applySplit(state, [3, 1]) // same as current
    expect(next).toBe(state)
  })
})

describe('checkWinner', () => {
  it('no winner at start', () => {
    expect(checkWinner(createInitialState())).toBeNull()
  })

  it('player2 wins when player1 is [0,0]', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 0, right: 0 },
    }
    expect(checkWinner(state)).toBe('player2')
  })

  it('player1 wins when player2 is [0,0]', () => {
    const state: GameState = {
      ...createInitialState(),
      player2: { left: 0, right: 0 },
    }
    expect(checkWinner(state)).toBe('player1')
  })

  it('no winner with [1, 0]', () => {
    const state: GameState = {
      ...createInitialState(),
      player1: { left: 1, right: 0 },
    }
    expect(checkWinner(state)).toBeNull()
  })
})
