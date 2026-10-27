import type { ReactNode } from 'react'

import type { InputCommand } from '../../core/input'
import type { MatchWorld } from '../../core/matchWorld'
import type { ActiveWindow } from '../../core/focusChain'
import type { MatchContentLabels } from '../../content/matchPack'
import { AlertsOverlay } from '../../windows/AlertsOverlay'
import { MinigameSurface, laneFromCanvasPointer } from './MinigameSurface'
import type { MinigameId } from '../../content/session'

import './testground.css'

export type WindowActionHandler = (
  window: ActiveWindow,
  command: InputCommand,
) => void

export type MatchTestgroundPanelsProps = {
  readonly world: MatchWorld
  readonly labels: MatchContentLabels
  readonly minigameId: MinigameId
  readonly onWindowAction: WindowActionHandler
  readonly onMinigamePointer: (code: string) => void
  readonly onDemoAlert: () => void
}

export function buildPlayingChildren({
  world,
  labels,
  minigameId,
  onWindowAction,
  onMinigamePointer,
  onDemoAlert,
}: MatchTestgroundPanelsProps): Partial<
  Record<'Minigame' | 'Loop' | 'Pulse' | 'Wave' | 'Echo', ReactNode>
> {
  return {
    Minigame: (
      <MinigameSurface
        minigame={world.minigame}
        minigameId={minigameId}
        onLanePointer={(offsetX, width) => {
          try {
            const lane = laneFromCanvasPointer(offsetX, width)
            const code =
              lane === 'left' ? 'Digit1' : lane === 'center' ? 'Digit2' : 'Digit3'
            onMinigamePointer(code)
          } catch {
            // Ignore out-of-bounds taps.
          }
        }}
      />
    ),
    Loop: (
      <ServicePanel eyebrow="Loop" title={labels.loopTitle}>
        <p className="testground-panel__meta">
          Clip {world.loop.currentIndex + 1} / {world.loop.clips.length}
        </p>
        <div className="testground-panel__actions">
          <button type="button" onClick={() => onWindowAction('Loop', { type: 'Like' })}>
            Like (L)
          </button>
          <button type="button" onClick={() => onWindowAction('Loop', { type: 'Repost' })}>
            Repost (R)
          </button>
          <button type="button" onClick={() => onWindowAction('Loop', { type: 'Next' })}>
            Next (N)
          </button>
          <button type="button" onClick={onDemoAlert}>
            Demo alert
          </button>
        </div>
      </ServicePanel>
    ),
    Pulse: (
      <ServicePanel
        eyebrow="Pulse"
        title={world.pulse.timeline[0]?.body.slice(0, 72) ?? 'Feed'}
      >
        <p className="testground-panel__meta">
          {world.pulse.timeline.length} posts in timeline
        </p>
        <div className="testground-panel__actions">
          <button type="button" onClick={() => onWindowAction('Pulse', { type: 'Like' })}>
            Like (L)
          </button>
          <button type="button" onClick={() => onWindowAction('Pulse', { type: 'Repost' })}>
            Repost (R)
          </button>
        </div>
      </ServicePanel>
    ),
    Wave: (
      <ServicePanel eyebrow="Wave" title={labels.waveTitle}>
        <p className="testground-panel__meta">
          Discovery streak {world.wave.discovery.streak} · heard{' '}
          {world.wave.heardTrackIds.size}
        </p>
        <div className="testground-panel__actions">
          <button type="button" onClick={() => onWindowAction('Wave', { type: 'Like' })}>
            Like (L)
          </button>
          <button type="button" onClick={() => onWindowAction('Wave', { type: 'Next' })}>
            Skip (N)
          </button>
        </div>
      </ServicePanel>
    ),
    Echo: (
      <ServicePanel eyebrow="Echo" title={labels.echoTitle}>
        <p className="testground-panel__meta">
          {Math.round(world.echo.positionMs / 1_000)}s /{' '}
          {Math.round(world.echo.currentItem.durationMs / 1_000)}s
        </p>
        <div className="testground-panel__actions">
          <button type="button" onClick={() => onWindowAction('Echo', { type: 'Like' })}>
            React (L)
          </button>
          <button type="button" onClick={() => onWindowAction('Echo', { type: 'Repost' })}>
            Subscribe (R)
          </button>
          <button type="button" onClick={() => onWindowAction('Echo', { type: 'Next' })}>
            Next (N)
          </button>
        </div>
      </ServicePanel>
    ),
  }
}

function ServicePanel({
  eyebrow,
  title,
  children,
}: {
  readonly eyebrow: string
  readonly title: string
  readonly children: ReactNode
}) {
  return (
    <div className="testground-panel">
      <p className="testground-panel__eyebrow">{eyebrow}</p>
      <p className="testground-panel__title">{title}</p>
      {children}
    </div>
  )
}

export function MatchAlertsLayer({
  world,
  onDismissAlert,
}: {
  readonly world: MatchWorld
  readonly onDismissAlert: () => void
}) {
  const alerts = world.alerts.activeAlert ? [world.alerts.activeAlert] : []
  if (alerts.length === 0) return null

  return (
    <>
      <AlertsOverlay alerts={alerts} />
      <button
        className="testground-alert-dismiss"
        type="button"
        onClick={onDismissAlert}
        style={{
          position: 'fixed',
          zIndex: 11,
          top: 'calc(var(--layout-inset) + 0.5rem)',
          right: 'calc(var(--layout-inset) + 0.5rem)',
        }}
      >
        Dismiss alert
      </button>
    </>
  )
}
