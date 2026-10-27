import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { AudioMixer } from '../audio/mixer'
import type { MatchContentLabels, MatchStarterPack } from '../content/matchPack'
import type { MinigameId } from '../content/session'
import { difficultyAt } from '../core/difficulty'
import type { InputCommand } from '../core/input'
import { routeInput } from '../core/input'
import { applyMatchReward } from '../core/matchRewards'
import {
  applyMinigameLaneInput,
  applyWindowCommand,
  createMatchWorld,
  dismissAlert,
  enqueueDemoAlert,
  openNextAlert,
  tickMatchWorld,
  type MatchWorld,
} from '../core/matchWorld'
import {
  createMatchSession,
  matchFocusNavigate,
  matchSurvivalSeconds,
  projectMatchView,
  tickMatch,
  type MatchCue,
  type MatchSession,
  type MatchView,
} from '../core/matchSession'
import type { ActiveWindow } from '../core/focusChain'
import { createAlertInputHandler } from '../windows/alerts'
import type { Clock } from '../testing/clock'
import { createFakeMediaPort } from '../testing/media'
import type { Rng } from '../testing/rng'
import { createSeededRng } from '../testing/rng'
import type { LayoutModel } from './layoutModel'
import { playShellCue } from './playingCues'
import { PlayingView, type PlayingViewProps } from './PlayingView'
import {
  MatchAlertsLayer,
  buildPlayingChildren,
} from './testground/MatchWindowPanels'

export type MatchPlayingProps = {
  readonly audio: AudioMixer
  readonly model: LayoutModel
  readonly onDepleted: (stats: MatchEndStats) => void
  readonly clock?: Clock
  readonly scheduleTick?: PlayingViewProps['scheduleTick']
  readonly accessibilityMode?: boolean
  readonly starterPack?: MatchStarterPack
  readonly contentLabels?: MatchContentLabels
  readonly minigameId?: MinigameId
  readonly rng?: Rng
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
  starterPack,
  contentLabels,
  minigameId = 'lane_defender',
  rng: rngProp,
}: MatchPlayingProps) {
  const rng = useMemo(() => rngProp ?? createSeededRng(0x948a), [rngProp])
  const mediaRef = useRef(createFakeMediaPort())
  const lastTickAtRef = useRef<number | null>(null)

  const testgroundEnabled = Boolean(starterPack && contentLabels)

  const [view, setView] = useState<MatchView>(() =>
    projectMatchView(createMatchSession(clock), clock),
  )
  const [world, setWorld] = useState<MatchWorld | null>(() =>
    starterPack && contentLabels
      ? createMatchWorld(starterPack, minigameId, rng, clock)
      : null,
  )

  const sessionRef = useRef(view.session)
  const depletedRef = useRef(false)
  const onDepletedRef = useRef(onDepleted)

  useEffect(() => {
    onDepletedRef.current = onDepleted
  }, [onDepleted])

  const publishSession = useCallback(
    (session: MatchSession, cues: readonly MatchCue[] = []) => {
      sessionRef.current = session
      const projected = projectMatchView(session, clock)
      setView({ ...projected, cues })
      dispatchCues(audio, cues)
      audio.applyFeelState(projected.feel)
    },
    [audio, clock],
  )

  const runWindowCommand = useCallback(
    (activeWindow: ActiveWindow, command: InputCommand) => {
      if (!testgroundEnabled || !world) return

      const result = applyWindowCommand(
        world,
        activeWindow,
        command,
        clock,
        rng,
        mediaRef.current,
      )

      void Promise.resolve(result).then((resolved) => {
        setWorld(resolved.world)
        publishSession(
          applyMatchReward(sessionRef.current, resolved.reward),
          resolved.cues,
        )
      })
    },
    [clock, publishSession, rng, testgroundEnabled, world],
  )

  const handleDemoAlert = useCallback(() => {
    if (!world) return
    const now = clock.now()
    const withAlert = enqueueDemoAlert(world, {
      id: `demo-${Math.floor(now)}`,
      message: 'Trending in your sector: touch grass (optional)',
      priority: 'Normal',
      category: 'valuable',
      reward: { dopamine: 1.2, score: 18 },
      destination: 'Pulse',
      expiresAtMs: now + 8_000,
    })
    const opened = openNextAlert(
      withAlert,
      sessionRef.current.focusChain,
      clock,
    )
    setWorld(opened.world)
    publishSession(
      applyMatchReward(sessionRef.current, opened.reward),
      opened.cues,
    )
  }, [clock, publishSession, world])

  const handleDismissAlert = useCallback(() => {
    if (!world) return
    setWorld(dismissAlert(world))
  }, [world])

  const handleMinigamePointer = useCallback(
    (code: string) => {
      if (!world) return
      setWorld(applyMinigameLaneInput(world, code))
    },
    [world],
  )

  useEffect(() => {
    return scheduleTick(() => {
      if (depletedRef.current) return

      const ticked = tickMatch(sessionRef.current, clock)
      let session = ticked.session
      let cues: MatchCue[] = [...ticked.cues]

      if (testgroundEnabled) {
        const now = clock.now()
        const deltaMs =
          lastTickAtRef.current === null
            ? 16
            : Math.max(0, now - lastTickAtRef.current)
        lastTickAtRef.current = now

        const elapsedMs = Math.max(0, now - session.startedAtMs)
        const difficulty = difficultyAt(elapsedMs)
        const sideEffects = {
          rewards: [] as import('../windows/loop').Reward[],
          cues: [] as MatchCue[],
        }

        setWorld((currentWorld) => {
          if (!currentWorld) return currentWorld
          const worldTick = tickMatchWorld(
            currentWorld,
            {
              deltaMs,
              difficultyMultiplier: difficulty.dopamineDrainMultiplier,
            },
            clock,
            rng,
          )
          sideEffects.rewards = [...worldTick.rewards]
          sideEffects.cues = [...worldTick.cues]
          return worldTick.world
        })

        for (const reward of sideEffects.rewards) {
          session = applyMatchReward(session, reward)
        }
        cues = [...cues, ...sideEffects.cues]
      }

      sessionRef.current = session
      const projected = projectMatchView(session, clock)
      setView({ ...projected, cues })
      audio.applyFeelState(projected.feel)
      dispatchCues(audio, cues)

      if (session.depleted && !depletedRef.current) {
        depletedRef.current = true
        onDepletedRef.current(endStats(session, clock))
      }
    })
  }, [audio, clock, rng, scheduleTick, testgroundEnabled])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || depletedRef.current) return

      if (testgroundEnabled && world) {
        const laneWorld = applyMinigameLaneInput(world, event.code)
        if (laneWorld !== world) {
          event.preventDefault()
          setWorld(laneWorld)
        }
      }

      const routed = routeInput(event.code, {
        activeAlert: world
          ? createAlertInputHandler(world.alerts)
          : undefined,
      })

      if (routed.command?.type === 'Navigate') {
        event.preventDefault()
        const next = matchFocusNavigate(
          sessionRef.current,
          clock,
          routed.command.window,
        )
        publishSession(next.session, next.cues)
        return
      }

      if (
        testgroundEnabled &&
        routed.consumedBy === 'ActiveWindow' &&
        routed.command
      ) {
        event.preventDefault()
        const active =
          sessionRef.current.focusChain.activeWindow ?? ('Pulse' as const)
        runWindowCommand(active, routed.command)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [clock, publishSession, runWindowCommand, testgroundEnabled, world])

  /* eslint-disable react-hooks/refs -- slot handlers run on input; sessionRef is tick-only */
  const childrenByWindow =
    testgroundEnabled && world && contentLabels
      ? buildPlayingChildren({
          world,
          labels: contentLabels,
          minigameId,
          onWindowAction: runWindowCommand,
          onMinigamePointer: handleMinigamePointer,
          onDemoAlert: handleDemoAlert,
        })
      : undefined
  /* eslint-enable react-hooks/refs */

  return (
    <>
      <PlayingView
        accessibilityMode={accessibilityMode}
        audio={audio}
        childrenByWindow={childrenByWindow}
        dopamine={view.session.dopamine.value}
        feel={view.feel}
        model={model}
        scheduleTick={noopScheduleTick}
        stickerEvents={view.stickerEvents}
      />
      {world ? (
        <MatchAlertsLayer onDismissAlert={handleDismissAlert} world={world} />
      ) : null}
    </>
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
