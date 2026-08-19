import { useEffect, useRef, useState } from 'react'
import { GAME_TITLE } from '../../config/tunables'
import '../OsWindow/OsWindow.css'
import './LoadingSplash.css'

type LoadingSplashProps = {
  onReady: () => void
}

const SERVICE_ICONS = [
  { label: 'Loop', color: '#ff4d6d' },
  { label: 'Pulse', color: '#1da1f2' },
  { label: 'Wave', color: '#1db954' },
  { label: 'Echo', color: '#ff0033' },
  { label: 'Alerts', color: '#f5a623' },
] as const

const SIMULATED_DURATION_MS = 2800

export function LoadingSplash({ onReady }: LoadingSplashProps) {
  const [progress, setProgress] = useState(0)
  const [activeIcons, setActiveIcons] = useState<Set<number>>(new Set())
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / SIMULATED_DURATION_MS)
      // Ease-out cubic for snappy feel
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased)

      // Light up icons progressively
      const iconsToShow = Math.floor(t * SERVICE_ICONS.length)
      setActiveIcons((prev) => {
        if (prev.size >= iconsToShow) return prev
        const next = new Set(prev)
        next.add(iconsToShow - 1)
        return next
      })

      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        onReadyRef.current()
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="loading-splash" data-surface="loading">
      <div className="loading-splash__stage" aria-hidden="true">
        <div className="loading-splash__bloom loading-splash__bloom--a" />
        <div className="loading-splash__bloom loading-splash__bloom--b" />
        <div className="loading-splash__grid" />
      </div>

      <div className="loading-splash__content">
        <h1 className="loading-splash__title">{GAME_TITLE}</h1>

        <div className="loading-splash__bar-track" role="status" aria-label="Loading starter pack">
          <div
            className="loading-splash__bar-fill"
            style={{ transform: `scaleX(${progress})` }}
          />
          <div className="loading-splash__bar-glow" style={{ left: `${progress * 100}%` }} />
        </div>

        <div className="loading-splash__icons">
          {SERVICE_ICONS.map((svc, i) => (
            <span
              key={svc.label}
              className={`loading-splash__icon ${activeIcons.has(i) ? 'loading-splash__icon--active' : ''}`}
              style={{ '--icon-color': svc.color } as React.CSSProperties}
            >
              <span className="loading-splash__icon-dot" />
              <span className="loading-splash__icon-label">{svc.label}</span>
            </span>
          ))}
        </div>

        <p className="loading-splash__hint">INITIALIZING SYSTEMS…</p>
      </div>

      <div className="crt-overlay" aria-hidden="true">
        <div className="crt-overlay__scanlines" />
        <div className="crt-overlay__glass" />
        <div className="crt-overlay__noise" />
      </div>
    </div>
  )
}
