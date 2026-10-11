import {
  WINDOW_REWARD_COOLDOWN_MS,
  WINDOW_REWARDS,
} from '../config/balance'
import {
  calculateInteractionGain,
  createDiminishingState,
  type DiminishingState,
} from '../core/dopamine'
import type { MediaPort } from '../testing/media'

export type LoopClip = {
  readonly id: string
  readonly source: string
}

export type LoopWindowState = 'Normal' | 'Waiting' | 'FocusReady'
export type LoopAction = 'Like' | 'Repost'
export type Reward = { readonly dopamine: number; readonly score: number }

export type LoopState = {
  readonly clips: readonly LoopClip[]
  readonly currentIndex: number
  readonly currentClip: LoopClip
  readonly windowState: LoopWindowState
  readonly cooldownEndsAtMs: number | null
  readonly opportunity: { readonly expiresAtMs: number } | null
  readonly diminishing: DiminishingState
}

const NO_REWARD: Reward = { dopamine: 0, score: 0 }

export function createLoop(clips: readonly LoopClip[]): LoopState {
  const currentClip = clips[0]
  if (!currentClip) {
    throw new Error('Loop requires at least one clip')
  }

  return {
    clips,
    currentIndex: 0,
    currentClip,
    windowState: 'Normal',
    cooldownEndsAtMs: null,
    opportunity: null,
    diminishing: createDiminishingState(),
  }
}

export function handleLoopMediaEnded(state: LoopState): LoopState {
  return state
}

export async function nextLoopClip(
  state: LoopState,
  media: MediaPort,
): Promise<{ readonly state: LoopState; readonly reward: Reward }> {
  const currentIndex = (state.currentIndex + 1) % state.clips.length
  const currentClip = state.clips[currentIndex]!
  await media.play(currentClip.id)

  return {
    state: {
      ...state,
      currentIndex,
      currentClip,
      diminishing: createDiminishingState(),
    },
    reward: WINDOW_REWARDS.Loop.NextVideo,
  }
}

export function loopAction(
  state: LoopState,
  action: LoopAction,
): { readonly state: LoopState; readonly reward: Reward } {
  const baseReward = WINDOW_REWARDS.Loop[action]
  const result = calculateInteractionGain(state.diminishing, {
    systemId: 'Loop',
    targetId: `${state.currentClip.id}:${action}`,
    baseGain: baseReward.dopamine,
  })
  const multiplier =
    baseReward.dopamine === 0 ? 0 : result.gain / baseReward.dopamine

  return {
    state: { ...state, diminishing: result.state },
    reward: {
      dopamine: result.gain,
      score: baseReward.score * multiplier,
    },
  }
}

export function createLoopOpportunity(
  state: LoopState,
  expiresAtMs: number,
): LoopState {
  return { ...state, opportunity: { expiresAtMs } }
}

export function respondToLoopOpportunity(
  state: LoopState,
  nowMs: number,
): { readonly state: LoopState; readonly reward: Reward } {
  if (!state.opportunity || nowMs >= state.opportunity.expiresAtMs) {
    return { state: tickLoop(state, nowMs), reward: NO_REWARD }
  }

  return {
    state: { ...state, opportunity: null },
    reward: WINDOW_REWARDS.Loop.InteractiveOpportunity,
  }
}

export function leaveLoop(state: LoopState, nowMs: number): LoopState {
  return {
    ...state,
    windowState: 'Waiting',
    cooldownEndsAtMs: nowMs + WINDOW_REWARD_COOLDOWN_MS,
  }
}

export function tickLoop(state: LoopState, nowMs: number): LoopState {
  const opportunity =
    state.opportunity && nowMs >= state.opportunity.expiresAtMs
      ? null
      : state.opportunity
  const focusReady =
    state.windowState === 'Waiting' &&
    state.cooldownEndsAtMs !== null &&
    nowMs >= state.cooldownEndsAtMs

  return {
    ...state,
    opportunity,
    windowState: focusReady ? 'FocusReady' : state.windowState,
    cooldownEndsAtMs: focusReady ? null : state.cooldownEndsAtMs,
  }
}
