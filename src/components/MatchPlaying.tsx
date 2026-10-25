import { useEffect, useRef, useState } from 'react'

import type { AudioMixer } from '../audio/mixer'
import {
  createMatchSession,
  matchFocusNavigate,
  matchSurvivalSeconds,
  projectMatchView,
  tickMatch,
  type MatchSession,
  type MatchView,
} from '../core/matchSession'
import { routeInput } from '../core/input'
import type { Clock } from '../testing/clock'
import type { LayoutModel } from './layoutModel'
import { playShellCue } from './playingCues'
import { PlayingView, type PlayingViewProps } from './PlayingView'

export type MatchPlayingProps = {
  readonly audio: AudioMixer
  readonly model: LayoutModel
  readonly onDepleted: (stats: MatchEndStats) => void
  readonly clock?: Clock
  readonly scheduleTick?: PlayingViewProps['scheduleTick']
  readonly accessibilityMode?: boolean
}

export type MatchEndStats = {
  readonly survivalTimeSeconds: number
  readonly finalScore: number
  readonly highestCombo: number
  readonly longestFocusChain: number
  readonly burnoutsTriggered: number
}

export function MatchPlaying({
  audio,
  model,
  onDepleted,
  clock = performanceClock,
  scheduleTick = rafScheduleTick,
  accessibilityMode,
}: MatchPlayingProps) {
  const [view, setView] = useState<MatchView>(() =>
    projectMatchView(createMatchSession(clock), clock),
  )
  const sessionRef = useRef(view.session)
  const depletedRef = useRef(false)
  const onDepletedRef = useRef(onDepleted)

  useEffect(() => {
    onDepletedRef.current = onDepleted
  }, [onDepleted])

  useEffect(() => {
    return scheduleTick(() => {
      if (depletedRef.current) return

      const next = tickMatch(sessionRef.current, clock)
      sessionRef.current = next.session
      setView(next)
      // Parent owns the Match tick; apply feel here so PlayingView need not
      // register a second scheduler (tests inject a single scheduleTick).
      audio.applyFeelState(next.feel)
      dispatchCues(audio, next.cues)

      if (next.session.depleted && !depletedRef.current) {
        depletedRef.current = true
        onDepletedRef.current(endStats(next.session, clock))
      }
    })
  }, [audio, clock, scheduleTick])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || depletedRef.current) return

      const routed = routeInput(event.code)
      if (routed.command?.type !== 'Navigate') return

      event.preventDefault()
      const next = matchFocusNavigate(
        sessionRef.current,
        clock,
        routed.command.window,
      )
      sessionRef.current = next.session
      setView(next)
      dispatchCues(audio, next.cues)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [audio, clock])

  return (
    <PlayingView
      accessibilityMode={accessibilityMode}
      audio={audio}
      dopamine={view.session.dopamine.value}
      feel={view.feel}
      model={model}
      scheduleTick={noopScheduleTick}
      stickerEvents={view.stickerEvents}
    />
  )
}

function noopScheduleTick(_onTick: () => void): () => void {
  return () => {}
}

function dispatchCues(
  audio: AudioMixer,
  cues: MatchView['cues'],
): void {
  for (const cue of cues) {
    playShellCue(audio, cue)
  }
}

function endStats(session: MatchSession, clock: Clock): MatchEndStats {
  return {
    survivalTimeSeconds: Math.floor(matchSurvivalSeconds(session, clock)),
    finalScore: session.score,
    highestCombo: session.highestCombo,
    longestFocusChain: session.longestFocusChain,
    burnoutsTriggered: session.burnoutsTriggered,
  }
}

const performanceClock: Clock = {
  now: () =>
    typeof performance !== 'undefined' ? performance.now() : Date.now(),
}

function rafScheduleTick(onTick: () => void): () => void {
  let frame = 0
  const loop = () => {
    onTick()
    frame = requestAnimationFrame(loop)
  }
  frame = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(frame)
}
