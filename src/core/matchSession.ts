import type { FeelAudioState } from '../audio/muffling'
import { recoveryProgress } from '../audio/muffling'
import type { ShellCueEvent } from '../components/playingCues'
import {
  burnoutStickerEvents,
  type StickerEvent,
} from '../components/stickers'
import {
  createBurnoutSystem,
  recordAction,
  tickBurnout,
  type BurnoutSystem,
} from './burnout'
import { difficultyAt } from './difficulty'
import {
  createDopamineMeter,
  grantDopamine,
  tickDopamine,
  type DopamineMeter,
} from './dopamine'
import {
  createFocusChain,
  expireFocusChain,
  type ActiveWindow,
  type FocusChain,
} from './focusChain'
import { applyNavigation } from './input'
import type { Clock } from '../testing/clock'

export type MatchCue = ShellCueEvent

export type MatchSession = {
  readonly dopamine: DopamineMeter
  readonly burnout: BurnoutSystem
  readonly focusChain: FocusChain
  readonly startedAtMs: number
  readonly score: number
  readonly longestFocusChain: number
  readonly highestCombo: number
  readonly burnoutsTriggered: number
  readonly depleted: boolean
}

export type MatchView = {
  readonly session: MatchSession
  readonly feel: FeelAudioState
  readonly stickerEvents: readonly StickerEvent[]
  readonly cues: readonly MatchCue[]
}

export function createMatchSession(clock: Clock): MatchSession {
  return {
    dopamine: createDopamineMeter(clock),
    burnout: createBurnoutSystem(clock),
    focusChain: createFocusChain(),
    startedAtMs: clock.now(),
    score: 0,
    longestFocusChain: 0,
    highestCombo: 0,
    burnoutsTriggered: 0,
    depleted: false,
  }
}

export function tickMatch(session: MatchSession, clock: Clock): MatchView {
  if (session.depleted) {
    return projectMatchView(session, clock)
  }

  const expired = expireFocusChain(session.focusChain, clock.now())
  let next: MatchSession = {
    ...session,
    focusChain: expired.chain,
    dopamine: grantDopamine(session.dopamine, expired.completionBonus.dopamine),
    score: session.score + expired.completionBonus.score,
  }

  const burnout = tickBurnout(next.burnout, clock)
  const burnoutsTriggered =
    next.burnout.mode !== 'Burnout' && burnout.mode === 'Burnout'
      ? next.burnoutsTriggered + 1
      : next.burnoutsTriggered

  const elapsedMs = clock.now() - next.startedAtMs
  const difficulty = difficultyAt(Math.max(0, elapsedMs))
  const dopamine = tickDopamine(next.dopamine, clock, {
    difficultyMultiplier: difficulty.dopamineDrainMultiplier,
    recovery: burnout.mode === 'Recovery',
  })

  next = {
    ...next,
    burnout,
    burnoutsTriggered,
    dopamine,
    depleted: dopamine.value <= 0,
  }

  return projectMatchView(next, clock)
}

export function matchFocusNavigate(
  session: MatchSession,
  clock: Clock,
  destination: ActiveWindow,
): MatchView {
  if (session.depleted) {
    return projectMatchView(session, clock)
  }

  const burnoutWithAction: BurnoutSystem = {
    ...session.burnout,
    apmTracker: recordAction(session.burnout.apmTracker, clock),
  }

  const focus = applyNavigation(
    session.focusChain,
    { type: 'Navigate', window: destination },
    clock.now(),
    'Normal',
  )

  const dopamine = grantDopamine(
    session.dopamine,
    focus.stepBonus.dopamine + focus.completionBonus.dopamine,
  )

  const next: MatchSession = {
    ...session,
    burnout: burnoutWithAction,
    focusChain: focus.chain,
    dopamine,
    score: session.score + focus.stepBonus.score + focus.completionBonus.score,
    longestFocusChain: Math.max(session.longestFocusChain, focus.chain.length),
  }

  const view = projectMatchView(next, clock)
  return {
    ...view,
    cues: focus.extended ? ['focusChainStep'] : [],
  }
}

export function matchAlertOpen(
  session: MatchSession,
  clock: Clock,
): MatchView {
  return {
    ...projectMatchView(session, clock),
    cues: session.depleted ? [] : ['alertOpen'],
  }
}

export function matchMinigameHit(
  session: MatchSession,
  clock: Clock,
): MatchView {
  return {
    ...projectMatchView(session, clock),
    cues: session.depleted ? [] : ['minigameHit'],
  }
}

export function projectMatchView(
  session: MatchSession,
  clock: Clock,
): MatchView {
  const feel: FeelAudioState = {
    mode: session.burnout.mode,
    activeWindow: session.focusChain.activeWindow,
    recoveryProgress:
      session.burnout.mode === 'Recovery'
        ? recoveryProgress(session.burnout.recoveryEndsAtMs, clock.now())
        : undefined,
  }

  const stickers: StickerEvent[] = [
    ...(session.focusChain.length > 0
      ? [
          {
            type: 'FocusChain' as const,
            length: session.focusChain.length,
            id: 'focus-chain',
          },
        ]
      : []),
    ...burnoutStickerEvents({
      telegraphActive: session.burnout.telegraphActive,
      mode: session.burnout.mode,
    }),
  ]

  return {
    session,
    feel,
    stickerEvents: stickers,
    cues: [],
  }
}

export function matchSurvivalSeconds(
  session: MatchSession,
  clock: Clock,
): number {
  return Math.max(0, (clock.now() - session.startedAtMs) / 1_000)
}
