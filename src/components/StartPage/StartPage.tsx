import { useEffect, useId, useState } from 'react'
import { GAME_TITLE, START_PAGE_WHISPER } from '../../config/tunables'
import {
  readAccessibilityMode,
  writeAccessibilityMode,
} from '../../core/accessibilityMode'
import { CreditsModal } from '../CreditsModal/CreditsModal'
import titleMark from '../../assets/title-dopamine.webp'
import './StartPage.css'

type StartPageProps = {
  onPlay: () => void
}

export function StartPage({ onPlay }: StartPageProps) {
  const [accessibilityMode, setAccessibilityMode] = useState(readAccessibilityMode)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const titleId = useId()

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = accessibilityMode
      ? 'true'
      : 'false'
  }, [accessibilityMode])

  function toggleAccessibility() {
    setAccessibilityMode((prev) => {
      const next = !prev
      writeAccessibilityMode(next)
      return next
    })
  }

  return (
    <div className="start-page" data-surface="start-page">
      <div className="start-page__stage" aria-hidden="true">
        <div className="start-page__bloom start-page__bloom--violet" />
        <div className="start-page__bloom start-page__bloom--magenta" />
        <svg className="start-page__rings" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle cx="50" cy="48" r="12" />
          <circle cx="50" cy="48" r="20" />
          <circle cx="50" cy="48" r="28" />
          <circle cx="50" cy="48" r="36" />
          <circle cx="50" cy="48" r="44" />
        </svg>
      </div>

      <div className="start-page__crt" aria-hidden="true" />

      <main className="start-page__main" aria-labelledby={titleId}>
        <section className="os-window start-page__window" aria-label={`${GAME_TITLE} start`}>
          <header className="os-window__chrome">
            <span className="os-window__traffic" aria-hidden="true">
              <i className="os-window__dot os-window__dot--close" />
              <i className="os-window__dot os-window__dot--min" />
              <i className="os-window__dot os-window__dot--max" />
            </span>
            <span className="os-window__title-chip">{GAME_TITLE}</span>
          </header>

          <div className="os-window__body">
            <h1 id={titleId} className="start-page__title">
              <img
                className="start-page__title-mark"
                src={titleMark}
                alt={GAME_TITLE}
                draggable={false}
              />
            </h1>

            {START_PAGE_WHISPER ? (
              <p className="start-page__whisper">{START_PAGE_WHISPER}</p>
            ) : null}

            <button type="button" className="play-button" onClick={onPlay}>
              <span className="play-button__face">PLAY</span>
            </button>
          </div>
        </section>
      </main>

      <div className="start-page__corners">
        <label className="start-page__a11y">
          <button
            type="button"
            role="switch"
            aria-checked={accessibilityMode}
            aria-label="Accessibility Mode"
            className="start-page__switch"
            onClick={toggleAccessibility}
          >
            <span className="start-page__switch-knob" />
          </button>
          <span className="start-page__a11y-label">Accessibility</span>
        </label>

        <button
          type="button"
          className="start-page__credits"
          onClick={() => setCreditsOpen(true)}
        >
          Credits
        </button>
      </div>

      {creditsOpen ? (
        <CreditsModal onClose={() => setCreditsOpen(false)} />
      ) : null}
    </div>
  )
}
