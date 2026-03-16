import { useState, useCallback } from 'react'
import {
  createInitialState,
  applyAttack,
  getValidSplits,
  applySplit,
  getValidAttackTargets,
  isHandAlive,
  getOpponent,
  type GameState,
  type Hand,
  type PlayerId,
  type SplitDistribution,
} from '../lib/game-engine'
import HandCard from './HandCard'

export default function GameBoard() {
  const [state, setState] = useState<GameState>(createInitialState)
  const [selectedHand, setSelectedHand] = useState<Hand | null>(null)
  const [showSplitPanel, setShowSplitPanel] = useState(false)

  const validSplits = getValidSplits(state)
  const canSplit = validSplits.length > 0

  const handleHandClick = useCallback(
    (player: PlayerId, hand: Hand) => {
      if (state.status !== 'playing') return

      // Current player clicking their own hand → select as attacker
      if (player === state.currentTurn) {
        if (!isHandAlive(state[player][hand])) return
        if (selectedHand === hand) {
          setSelectedHand(null)
        } else {
          setSelectedHand(hand)
        }
        return
      }

      // Clicking opponent's hand with a selected attacker → attack
      if (selectedHand !== null) {
        const targets = getValidAttackTargets(state, selectedHand)
        if (targets.includes(hand)) {
          setState((prev) => applyAttack(prev, selectedHand, hand))
          setSelectedHand(null)
        }
      }
    },
    [state, selectedHand],
  )

  const handleSplit = useCallback(
    (distribution: SplitDistribution) => {
      setState((prev) => applySplit(prev, distribution))
      setShowSplitPanel(false)
      setSelectedHand(null)
    },
    [],
  )

  const handleRestart = useCallback(() => {
    setState(createInitialState())
    setSelectedHand(null)
    setShowSplitPanel(false)
  }, [])

  const handleRematch = useCallback(
    (loser: PlayerId) => {
      const fresh = createInitialState()
      fresh.currentTurn = loser
      setState(fresh)
      setSelectedHand(null)
      setShowSplitPanel(false)
    },
    [],
  )

  const renderPlayerArea = (player: PlayerId) => {
    const playerState = state[player]
    const isCurrent = state.currentTurn === player
    const isP1 = player === 'player1'
    const opponent = getOpponent(state.currentTurn)
    const targets =
      selectedHand !== null ? getValidAttackTargets(state, selectedHand) : []

    return (
      <div
        className={`flex flex-col items-center gap-3.5 w-full px-6 sm:px-8 py-4 sm:py-5 ${
          isCurrent && state.status === 'playing'
            ? 'bg-accent-primary/[0.04]'
            : 'bg-bg-surface-subtle/50 opacity-70'
        }`}
      >
        <span
          className={`font-heading font-semibold text-[13px] sm:text-[14px] ${
            isCurrent && state.status === 'playing'
              ? 'text-accent-primary'
              : 'text-text-muted'
          }`}
        >
          {isP1 ? 'Jugador 1' : 'Jugador 2'}
          {isCurrent && state.status === 'playing' && ' — Tu turno'}
        </span>
        <div className="flex justify-around items-center w-full">
          {(['left', 'right'] as Hand[]).map((hand) => (
            <HandCard
              key={hand}
              value={playerState[hand]}
              side={hand}
              isActive={isCurrent}
              isSelectable={
                isCurrent &&
                state.status === 'playing' &&
                isHandAlive(playerState[hand]) &&
                !showSplitPanel
              }
              isSelected={isCurrent && selectedHand === hand}
              isTarget={
                player === opponent &&
                selectedHand !== null &&
                targets.includes(hand)
              }
              onClick={() => handleHandClick(player, hand)}
            />
          ))}
        </div>
      </div>
    )
  }

  const guideText =
    state.status === 'finished'
      ? null
      : showSplitPanel
        ? 'Elige una distribucion'
        : selectedHand
          ? 'Ahora toca una mano del rival'
          : 'Selecciona una de tus manos'

  return (
    <div className="flex flex-col items-center w-full max-w-[480px] mx-auto">
      <div className="w-full bg-bg-surface rounded-3xl overflow-hidden shadow-[0_4px_24px_#1A1A1A10]">
        {/* Player 2 area (top) */}
        {renderPlayerArea('player2')}

        {/* Turn indicator */}
        <div
          className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4"
          role="status"
        >
          {state.status === 'playing' && guideText && (
            <span className="font-heading font-semibold text-[13px] sm:text-[14px] text-accent-primary">
              ↓ {guideText}
            </span>
          )}
        </div>

        {/* Player 1 area (bottom) */}
        {renderPlayerArea('player1')}

        {/* Actions bar */}
        <div className="flex items-center justify-center gap-2.5 px-5 py-3 sm:py-4 pb-5">
          <button
            type="button"
            onClick={() => {
              setShowSplitPanel(!showSplitPanel)
              setSelectedHand(null)
            }}
            disabled={!canSplit || state.status !== 'playing'}
            className="flex items-center gap-1.5 h-11 px-5 bg-accent-primary text-white font-heading font-semibold text-[13px] sm:text-[14px] rounded-xl disabled:opacity-40 disabled:cursor-default transition-opacity"
          >
            ✂ Repartir
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1.5 h-11 px-4 bg-bg-surface-subtle border border-border text-text-secondary font-heading font-medium text-[12px] sm:text-[13px] rounded-xl hover:bg-border transition-colors"
          >
            ↻ Reiniciar
          </button>
          <a
            href="/como-jugar"
            className="flex items-center justify-center w-11 h-11 bg-bg-surface-subtle border border-border text-text-secondary rounded-xl hover:bg-border transition-colors text-[16px]"
            aria-label="Como jugar"
          >
            ?
          </a>
        </div>
      </div>

      {/* Split panel */}
      {showSplitPanel && state.status === 'playing' && (
        <div className="w-full bg-bg-surface rounded-2xl mt-3 p-5 shadow-[0_4px_24px_#1A1A1A10]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-semibold text-[15px] text-text-primary">
              Repartir dedos
            </span>
            <button
              type="button"
              onClick={() => setShowSplitPanel(false)}
              className="text-text-muted text-[13px] font-medium hover:text-text-primary"
            >
              Cancelar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {validSplits.map(([l, r]) => {
              const revivesHand =
                (state[state.currentTurn].left === 0 && l > 0) ||
                (state[state.currentTurn].right === 0 && r > 0)
              return (
                <button
                  key={`${l}-${r}`}
                  type="button"
                  onClick={() => handleSplit([l, r])}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-heading font-semibold text-[14px] transition-colors ${
                    revivesHand
                      ? 'border-success/50 bg-success/5 text-success hover:bg-success/10'
                      : 'border-border bg-bg-surface-subtle text-text-primary hover:bg-border'
                  }`}
                >
                  <span>{l}</span>
                  <span className="text-text-muted text-[12px]">|</span>
                  <span>{r}</span>
                  {revivesHand && (
                    <span className="text-[11px] font-medium ml-1">♻</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Victory overlay */}
      {state.status === 'finished' && state.winner && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-6">
          <div
            className="bg-bg-surface rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-6 max-w-sm w-full shadow-[0_8px_40px_#1A1A1A20]"
            role="dialog"
            aria-modal="true"
          >
            <span className="text-5xl" aria-hidden="true">🏆</span>
            <h2 className="font-heading font-bold text-2xl text-text-primary text-center">
              {state.winner === 'player1' ? 'Gana Jugador 1' : 'Gana Jugador 2'}!
            </h2>
            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() => handleRematch(getOpponent(state.winner!))}
                className="w-full h-12 bg-accent-primary text-white font-heading font-semibold text-[16px] rounded-xl hover:bg-accent-primary-hover transition-colors"
              >
                Revancha
              </button>
              <a
                href="/"
                className="w-full h-11 flex items-center justify-center bg-bg-surface-subtle border border-border text-text-primary font-heading font-medium text-[14px] rounded-xl hover:bg-border transition-colors"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
