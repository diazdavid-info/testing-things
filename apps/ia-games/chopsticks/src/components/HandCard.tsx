interface HandCardProps {
  value: number
  side: 'left' | 'right'
  isActive: boolean
  isSelectable: boolean
  isSelected: boolean
  isTarget: boolean
  onClick?: () => void
}

export default function HandCard({
  value,
  side,
  isActive,
  isSelectable,
  isSelected,
  isTarget,
  onClick,
}: HandCardProps) {
  const isDead = value === 0
  const emoji = side === 'left' ? '🤚' : '✋'

  const baseClasses =
    'flex flex-col items-center justify-center w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-[18px] sm:rounded-[20px] gap-0.5 transition-all duration-200 select-none'

  let stateClasses = ''
  if (isDead) {
    stateClasses = 'bg-bg-surface-subtle border-2 border-border opacity-40 cursor-default'
  } else if (isSelected) {
    stateClasses = 'bg-bg-surface border-2 border-accent-primary ring-2 ring-accent-primary/30 scale-105 cursor-pointer'
  } else if (isTarget) {
    stateClasses = 'bg-bg-surface border-2 border-accent-primary/60 animate-pulse cursor-pointer'
  } else if (isSelectable) {
    stateClasses = 'bg-bg-surface border-2 border-accent-primary cursor-pointer hover:scale-[1.03]'
  } else if (isActive) {
    stateClasses = 'bg-bg-surface border-2 border-border cursor-default'
  } else {
    stateClasses = 'bg-bg-surface border-2 border-border cursor-default'
  }

  return (
    <button
      type="button"
      className={`${baseClasses} ${stateClasses}`}
      onClick={isSelectable || isTarget ? onClick : undefined}
      disabled={isDead || (!isSelectable && !isTarget)}
      aria-label={`Mano ${side === 'left' ? 'izquierda' : 'derecha'}, ${isDead ? 'eliminada' : `${value} dedos`}`}
    >
      <span className={`text-[28px] sm:text-[32px] ${isDead ? 'grayscale' : ''}`} aria-hidden="true">
        {emoji}
      </span>
      <span className={`font-heading font-bold text-[22px] sm:text-[24px] ${isDead ? 'text-hand-dead' : 'text-text-primary'}`}>
        {value}
      </span>
    </button>
  )
}
