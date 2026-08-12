import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react'
import { GAME_TITLE, START_PAGE_WHISPER } from '../../config/tunables'
import {
  readAccessibilityMode,
  writeAccessibilityMode,
} from '../../core/accessibilityMode'
import { CreditsModal } from '../CreditsModal/CreditsModal'
import { OsWindowChrome } from '../OsWindow/OsWindowChrome'
import '../OsWindow/OsWindow.css'
import titleMark from '../../assets/title-dopamine.webp'
import { createBarrelDisplacementDataUrl } from './barrelMap'
import './StartPage.css'

type StartPageProps = {
  onPlay: () => void
}

type GlitchOffset = { x: number; y: number; rot: number }

const CHAOS_STICKERS = [
  { text: 'x7!!', className: 'chaos-sticker--combo', style: { top: '12%', left: '8%' } },
  { text: '+120', className: 'chaos-sticker--plus', style: { top: '22%', right: '10%' } },
  { text: 'FOCUS', className: 'chaos-sticker--focus', style: { bottom: '28%', left: '6%' } },
  { text: 'NEW', className: 'chaos-sticker--alert', style: { top: '18%', right: '22%' } },
  { text: 'LIVE', className: 'chaos-sticker--live', style: { bottom: '18%', right: '8%' } },
  { text: 'x2', className: 'chaos-sticker--combo-dim', style: { top: '40%', left: '14%' } },
  { text: '+45', className: 'chaos-sticker--plus-dim', style: { top: '55%', right: '16%' } },
] as const

export function StartPage({ onPlay }: StartPageProps) {
  const [accessibilityMode, setAccessibilityMode] = useState(readAccessibilityMode)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [pointer, setPointer] = useState({ x: 50, y: 45 })
  const [playHunger, setPlayHunger] = useState(0)
  const [glitch, setGlitch] = useState<GlitchOffset | null>(null)
  const [barrelMap, setBarrelMap] = useState('')
  const titleId = useId()
  const filterId = useId().replace(/:/g, '')
  const rootRef = useRef<HTMLDivElement>(null)
  const hungerStartedAt = useRef(performance.now())

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = accessibilityMode
      ? 'true'
      : 'false'
  }, [accessibilityMode])

  useEffect(() => {
    setBarrelMap(createBarrelDisplacementDataUrl(256, 1.55))
  }, [])

  useEffect(() => {
    if (accessibilityMode || creditsOpen) {
      setPlayHunger(0)
      return
    }
    hungerStartedAt.current = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const elapsed = (now - hungerStartedAt.current) / 1000
      // Exponential approach toward max hunger — grows fast, then claws for attention
      const hunger = 1 - Math.exp(-elapsed / 5.5)
      setPlayHunger(hunger)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [accessibilityMode, creditsOpen])

  useEffect(() => {
    if (accessibilityMode) {
      setGlitch(null)
      return
    }
    let timeout = 0
    let clear = 0

    const schedule = () => {
      const wait = 1800 + Math.random() * 4200
      timeout = window.setTimeout(() => {
        setGlitch({
          x: (Math.random() - 0.5) * 28,
          y: (Math.random() - 0.5) * 18,
          rot: (Math.random() - 0.5) * 2.4,
        })
        clear = window.setTimeout(() => {
          setGlitch(null)
          schedule()
        }, 70 + Math.random() * 110)
      }, wait)
    }

    schedule()
    return () => {
      window.clearTimeout(timeout)
      window.clearTimeout(clear)
    }
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

  function handlePlay() {
    setPlayHunger(0)
    onPlay()
  }

  const windowStyle = {
    '--glitch-x': `${glitch?.x ?? 0}px`,
    '--glitch-y': `${glitch?.y ?? 0}px`,
    '--glitch-rot': `${glitch?.rot ?? 0}deg`,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className="start-page"
      data-surface="start-page"
      data-glitching={glitch ? 'true' : 'false'}
      onPointerMove={onPointerMove}
      style={
        {
          '--grid-x': `${pointer.x}%`,
          '--grid-y': `${pointer.y}%`,
          '--play-hunger': playHunger,
        } as CSSProperties
      }
    >
      <svg className="start-page__filters" aria-hidden="true">
        <defs>
          <filter
            id={`crt-barrel-${filterId}`}
            x="-12%"
            y="-12%"
            width="124%"
            height="124%"
            colorInterpolationFilters="sRGB"
          >
            {barrelMap ? (
              <>
                <feImage
                  href={barrelMap}
                  result="map"
                  preserveAspectRatio="none"
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="map"
                  scale={accessibilityMode ? 12 : 48}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </>
            ) : null}
          </filter>
        </defs>
      </svg>

      <div
        className="start-page__warped"
        style={{ filter: barrelMap ? `url(#crt-barrel-${filterId})` : undefined }}
      >
        <div className="start-page__stage" aria-hidden="true">
          <div className="start-page__bloom start-page__bloom--violet" />
          <div className="start-page__bloom start-page__bloom--magenta" />
          <div className="start-page__bloom start-page__bloom--drift" />
          <div className="start-page__bloom start-page__bloom--hot" />
          <div className="start-page__grid" />
          <div className="start-page__grid start-page__grid--glow" />

          <div className="start-page__chaos">
            <div className="ghost-window ghost-window--a" />
            <div className="ghost-window ghost-window--b" />
            <div className="ghost-window ghost-window--c" />
            <div className="chaos-streak chaos-streak--a" />
            <div className="chaos-streak chaos-streak--b" />
            <div className="chaos-ping chaos-ping--a" />
            <div className="chaos-ping chaos-ping--b" />
            {CHAOS_STICKERS.map((sticker) => (
              <span
                key={sticker.text + sticker.className}
                className={`chaos-sticker ${sticker.className}`}
                style={sticker.style}
              >
                {sticker.text}
              </span>
            ))}
          </div>
        </div>

        <main className="start-page__main" aria-labelledby={titleId}>
          <section
            className="os-window start-page__window"
            aria-label={`${GAME_TITLE} start`}
            style={windowStyle}
          >
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

              <button type="button" className="play-button" onClick={handlePlay}>
                <span className="play-button__aura" />
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

      <div className="crt-overlay" aria-hidden="true">
        <div className="crt-overlay__scanlines" />
        <div className="crt-overlay__glass" />
        <div className="crt-overlay__noise" />
      </div>
    </div>
  )
}
