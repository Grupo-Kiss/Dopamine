import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { GAME_TITLE, START_PAGE_WHISPER } from '../../config/tunables'
import {
  readAccessibilityMode,
  writeAccessibilityMode,
} from '../../core/accessibilityMode'
import { CreditsModal } from '../CreditsModal/CreditsModal'
import { OsWindowChrome } from '../OsWindow/OsWindowChrome'
import '../OsWindow/OsWindow.css'
import titleMark from '../../assets/title-dopamine.webp'
import './StartPage.css'

type StartPageProps = {
  onPlay: () => void
}

export function StartPage({ onPlay }: StartPageProps) {
  const [accessibilityMode, setAccessibilityMode] = useState(readAccessibilityMode)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [pointer, setPointer] = useState({ x: 50, y: 45 })
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = accessibilityMode
      ? 'true'
      : 'false'
  }, [accessibilityMode])

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (accessibilityMode) return
      const node = rootRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      setPointer({
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y)),
      })
    },
    [accessibilityMode],
  )

  function toggleAccessibility() {
    setAccessibilityMode((prev) => {
      const next = !prev
      writeAccessibilityMode(next)
      return next
    })
  }

  return (
    <div
      ref={rootRef}
      className="start-page"
      data-surface="start-page"
      onPointerMove={onPointerMove}
      style={
        {
          '--grid-x': `${pointer.x}%`,
          '--grid-y': `${pointer.y}%`,
        } as CSSProperties
      }
    >
      <div className="start-page__stage" aria-hidden="true">
        <div className="start-page__bloom start-page__bloom--violet" />
        <div className="start-page__bloom start-page__bloom--magenta" />
        <div className="start-page__bloom start-page__bloom--drift" />
        <div className="start-page__grid" />
        <div className="start-page__grid start-page__grid--glow" />
      </div>

      <main className="start-page__main" aria-labelledby={titleId}>
        <section className="os-window start-page__window" aria-label={`${GAME_TITLE} start`}>
          <OsWindowChrome title={GAME_TITLE} />

          <div className="os-window__body start-page__window-body">
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

      {/* Topmost glass: scanlines + tube vignette + lo-fi over everything below */}
      <div className="crt-overlay" aria-hidden="true">
        <div className="crt-overlay__scanlines" />
        <div className="crt-overlay__glass" />
        <div className="crt-overlay__noise" />
      </div>
    </div>
  )
}
