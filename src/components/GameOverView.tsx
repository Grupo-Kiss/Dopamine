import { useState } from 'react'

import { useAccessibilityMode } from './accessibility'
import type { CreditsStore } from './credits'
import { CreditsModal } from './CreditsModal'

export type MatchSummary = {
  readonly survivalTimeSeconds: number
  readonly finalScore: number
  readonly highestCombo: number
  readonly longestFocusChain: number
  readonly burnoutsTriggered: number
}

export type GameOverViewProps = {
  readonly credits: CreditsStore
  readonly stats: MatchSummary
  readonly onPlayAgain: () => void
  readonly onReturnToHub: () => void
}

export function GameOverView({
  credits,
  stats,
  onPlayAgain,
  onReturnToHub,
}: GameOverViewProps) {
  const [accessibilityMode, setAccessibilityMode] = useAccessibilityMode()
  const [creditsOpen, setCreditsOpen] = useState(false)

  const rows = [
    ['Survival Time', formatDuration(stats.survivalTimeSeconds)],
    ['Final Score', stats.finalScore.toLocaleString('en-US')],
    ['Highest Combo', `x${stats.highestCombo}`],
    ['Longest Focus Chain', String(stats.longestFocusChain)],
    ['Burnouts Triggered', String(stats.burnoutsTriggered)],
  ] as const

  return (
    <main
      aria-label="Game Over"
      className="game-over"
      data-accessibility-mode={accessibilityMode}
    >
      <p className="eyebrow">The stimulation stopped</p>
      <h1>Game Over</h1>

      <dl className="game-over__stats">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <label className="hub__toggle">
        <input
          checked={accessibilityMode}
          onChange={(event) => setAccessibilityMode(event.target.checked)}
          type="checkbox"
        />
        Accessibility Mode
      </label>

      <div className="hub__actions">
        <button className="hub__play" onClick={onPlayAgain} type="button">
          Play Again
        </button>
        <button onClick={onReturnToHub} type="button">
          Return to hub
        </button>
        <button onClick={() => setCreditsOpen(true)} type="button">
          Credits
        </button>
      </div>

      {creditsOpen && (
        <CreditsModal
          credits={credits}
          onClose={() => setCreditsOpen(false)}
        />
      )}
    </main>
  )
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
