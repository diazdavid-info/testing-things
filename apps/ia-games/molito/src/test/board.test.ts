// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { POSITIONS, ADJACENCY, MILLS, checkMill } from '../lib/board'
import type { BoardCell } from '../lib/game'

describe('Board topology', () => {
  it('has exactly 24 positions', () => {
    expect(POSITIONS).toHaveLength(24)
  })

  it('each position has between 2 and 4 neighbors', () => {
    for (let i = 0; i < 24; i++) {
      const neighbors = ADJACENCY[i]
      expect(neighbors.length).toBeGreaterThanOrEqual(2)
      expect(neighbors.length).toBeLessThanOrEqual(4)
    }
  })

  it('adjacencies are symmetric', () => {
    for (let i = 0; i < 24; i++) {
      for (const neighbor of ADJACENCY[i]) {
        expect(ADJACENCY[neighbor]).toContain(i)
      }
    }
  })

  it('has exactly 16 mills', () => {
    expect(MILLS).toHaveLength(16)
  })

  it('each position appears in at least 2 mills', () => {
    for (let pos = 0; pos < 24; pos++) {
      const count = MILLS.filter(([a, b, c]) => a === pos || b === pos || c === pos).length
      expect(count).toBeGreaterThanOrEqual(2)
    }
  })

  it('all mill indices are valid positions (0-23)', () => {
    for (const [a, b, c] of MILLS) {
      expect(a).toBeGreaterThanOrEqual(0)
      expect(a).toBeLessThanOrEqual(23)
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThanOrEqual(23)
      expect(c).toBeGreaterThanOrEqual(0)
      expect(c).toBeLessThanOrEqual(23)
    }
  })
})

describe('checkMill', () => {
  function emptyBoard(): BoardCell[] {
    return Array.from({ length: 24 }, () => null)
  }

  it('detects a horizontal mill on outer square (top)', () => {
    const board = emptyBoard()
    board[0] = 'player1'
    board[1] = 'player1'
    board[2] = 'player1'
    expect(checkMill(board, 2, 'player1')).toBe(true)
  })

  it('detects a vertical mill on outer square (left)', () => {
    const board = emptyBoard()
    board[0] = 'player1'
    board[9] = 'player1'
    board[21] = 'player1'
    expect(checkMill(board, 9, 'player1')).toBe(true)
  })

  it('detects a mill on cross line (vertical center)', () => {
    const board = emptyBoard()
    board[1] = 'player2'
    board[4] = 'player2'
    board[7] = 'player2'
    expect(checkMill(board, 7, 'player2')).toBe(true)
  })

  it('does not detect mill with mixed players', () => {
    const board = emptyBoard()
    board[0] = 'player1'
    board[1] = 'player2'
    board[2] = 'player1'
    expect(checkMill(board, 0, 'player1')).toBe(false)
  })

  it('does not detect incomplete mill (only 2 pieces)', () => {
    const board = emptyBoard()
    board[0] = 'player1'
    board[1] = 'player1'
    expect(checkMill(board, 1, 'player1')).toBe(false)
  })

  it("checks only the specific player's pieces", () => {
    const board = emptyBoard()
    board[0] = 'player2'
    board[1] = 'player2'
    board[2] = 'player2'
    expect(checkMill(board, 2, 'player1')).toBe(false)
    expect(checkMill(board, 2, 'player2')).toBe(true)
  })
})
