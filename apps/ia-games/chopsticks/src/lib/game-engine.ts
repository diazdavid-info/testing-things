export type Hand = 'left' | 'right'
export type PlayerId = 'player1' | 'player2'
export type GameStatus = 'playing' | 'finished'

export interface PlayerState {
  left: number
  right: number
}

export interface GameState {
  player1: PlayerState
  player2: PlayerState
  currentTurn: PlayerId
  status: GameStatus
  winner: PlayerId | null
}

export function createInitialState(): GameState {
  return {
    player1: { left: 1, right: 1 },
    player2: { left: 1, right: 1 },
    currentTurn: 'player1',
    status: 'playing',
    winner: null,
  }
}

export function getOpponent(player: PlayerId): PlayerId {
  return player === 'player1' ? 'player2' : 'player1'
}

export function isHandAlive(value: number): boolean {
  return value > 0
}

export function getAliveHands(player: PlayerState): Hand[] {
  const hands: Hand[] = []
  if (isHandAlive(player.left)) hands.push('left')
  if (isHandAlive(player.right)) hands.push('right')
  return hands
}

export function isPlayerEliminated(player: PlayerState): boolean {
  return player.left === 0 && player.right === 0
}

export function isValidAttack(
  state: GameState,
  sourceHand: Hand,
  targetHand: Hand,
): boolean {
  if (state.status !== 'playing') return false
  const attacker = state[state.currentTurn]
  const defender = state[getOpponent(state.currentTurn)]
  return attacker[sourceHand] > 0 && defender[targetHand] > 0
}

export function getValidAttackTargets(state: GameState, sourceHand: Hand): Hand[] {
  if (state.status !== 'playing') return []
  const attacker = state[state.currentTurn]
  if (attacker[sourceHand] <= 0) return []
  const defender = state[getOpponent(state.currentTurn)]
  const targets: Hand[] = []
  if (defender.left > 0) targets.push('left')
  if (defender.right > 0) targets.push('right')
  return targets
}

export function applyAttack(
  state: GameState,
  sourceHand: Hand,
  targetHand: Hand,
): GameState {
  if (!isValidAttack(state, sourceHand, targetHand)) return state

  const attacker = state[state.currentTurn]
  const opponentId = getOpponent(state.currentTurn)
  const defender = { ...state[opponentId] }

  defender[targetHand] = defender[targetHand] + attacker[sourceHand]
  if (defender[targetHand] >= 5) {
    defender[targetHand] = 0
  }

  const newState: GameState = {
    ...state,
    [opponentId]: defender,
    currentTurn: opponentId,
  }

  if (isPlayerEliminated(defender)) {
    newState.status = 'finished'
    newState.winner = state.currentTurn
    newState.currentTurn = state.currentTurn
  }

  return newState
}

export type SplitDistribution = [number, number]

export function getValidSplits(state: GameState): SplitDistribution[] {
  const player = state[state.currentTurn]
  const total = player.left + player.right
  const splits: SplitDistribution[] = []

  for (let left = 0; left <= 4; left++) {
    const right = total - left
    if (right < 0 || right > 4) continue
    if (left === player.left && right === player.right) continue
    splits.push([left, right])
  }

  return splits
}

export function applySplit(
  state: GameState,
  distribution: SplitDistribution,
): GameState {
  const validSplits = getValidSplits(state)
  const isValid = validSplits.some(
    (s) => s[0] === distribution[0] && s[1] === distribution[1],
  )
  if (!isValid) return state

  const currentPlayer = { ...state[state.currentTurn] }
  currentPlayer.left = distribution[0]
  currentPlayer.right = distribution[1]

  return {
    ...state,
    [state.currentTurn]: currentPlayer,
    currentTurn: getOpponent(state.currentTurn),
  }
}

export function checkWinner(state: GameState): PlayerId | null {
  if (isPlayerEliminated(state.player1)) return 'player2'
  if (isPlayerEliminated(state.player2)) return 'player1'
  return null
}
