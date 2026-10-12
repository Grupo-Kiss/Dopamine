import { useState } from 'react'

import { useAccessibilityMode } from './accessibility'
import type { CreditsStore } from './credits'
import { CreditsModal } from './CreditsModal'

export type StartPageProps = {
  readonly credits: CreditsStore
  readonly onPlay: () => void
}

export function StartPage({ credits, onPlay }: StartPageProps) {
  const [accessibilityMode, setAccessibilityMode] = useAccessibilityMode()
  const [creditsOpen, setCreditsOpen] = useState(false)

  return (
    <main
      aria-label="Dopamine hub"
      className="hub"
      data-accessibility-mode={accessibilityMode}
    >
      <div className="hub__content">
        <p className="eyebrow">Attention is the objective</p>
        <h1>Dopamine</h1>
        <p className="hub__instructions">
          Dopamine drains constantly. Switch windows, build a Focus Chain, and
          survive the noise.
        </p>

        <label className="hub__toggle">
          <input
            checked={accessibilityMode}
            onChange={(event) => setAccessibilityMode(event.target.checked)}
            type="checkbox"
          />
          Accessibility Mode
        </label>

        <div className="hub__actions">
          <button className="hub__play" onClick={onPlay} type="button">
            Play
          </button>
          <button
            className="hub__link"
            onClick={() => setCreditsOpen(true)}
            type="button"
          >
            Credits
          </button>
        </div>
      </div>

      {creditsOpen && (
        <CreditsModal credits={credits} onClose={() => setCreditsOpen(false)} />
      )}
    </main>
  )
}
