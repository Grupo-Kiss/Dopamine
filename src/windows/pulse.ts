import { EVENT_INTERVAL_EARLY_MS, WINDOW_REWARDS } from '../config/balance'
import {
  calculateInteractionGain,
  createDiminishingState,
  type DiminishingState,
} from '../core/dopamine'
import type { Reward } from './loop'

export type PulsePost = {
  readonly id: string
  readonly userId: string
  readonly body: string
  readonly category: string
  readonly rewardable: boolean
}

export type PulseComposer =
  | { readonly mode: 'Reply'; readonly postId: string; readonly text: string }
  | {
      readonly mode: 'CreatePost'
      readonly postId: null
      readonly text: string
    }

export type PulseAttentionKind = 'Mention' | 'Trend'

export type PulseState = {
  readonly windowState: 'Normal'
  readonly timeline: readonly PulsePost[]
  readonly composer: PulseComposer | null
  readonly attentionRequest: {
    readonly kind: PulseAttentionKind
    readonly expiresAtMs: number
  } | null
  readonly diminishing: DiminishingState
}

const NO_REWARD: Reward = WINDOW_REWARDS.Noise

export function createPulse(posts: readonly PulsePost[]): PulseState {
  if (posts.length === 0) {
    throw new Error('Pulse requires at least one post')
  }

  return {
    windowState: 'Normal',
    timeline: [...posts],
    composer: null,
    attentionRequest: null,
    diminishing: createDiminishingState(),
  }
}

export function pulseShortcut(
  state: PulseState,
  code: string,
  postId: string,
): { readonly state: PulseState; readonly reward: Reward } {
  if (code === 'KeyC') {
    return {
      state: {
        ...state,
        composer: { mode: 'Reply', postId, text: '' },
      },
      reward: NO_REWARD,
    }
  }
  if (code === 'KeyP') {
    return {
      state: {
        ...state,
        composer: { mode: 'CreatePost', postId: null, text: '' },
      },
      reward: NO_REWARD,
    }
  }

  const action: 'Like' | 'Repost' | null =
    code === 'KeyL' ? 'Like' : code === 'KeyR' ? 'Repost' : null
  if (!action) {
    return { state, reward: NO_REWARD }
  }

  const post = state.timeline.find((candidate) => candidate.id === postId)
  if (!post) {
    throw new Error(`Unknown Pulse post: ${postId}`)
  }
  if (!post.rewardable) {
    return { state, reward: NO_REWARD }
  }

  const baseReward = WINDOW_REWARDS.Pulse[action]
  const result = calculateInteractionGain(state.diminishing, {
    systemId: 'Pulse',
    targetId: `${post.id}:${action}`,
    baseGain: baseReward.dopamine,
  })
  const multiplier = result.gain / baseReward.dopamine

  return {
    state: { ...state, diminishing: result.state },
    reward: {
      dopamine: result.gain,
      score: baseReward.score * multiplier,
    },
  }
}

export function publishPulseText(
  state: PulseState,
  text: string,
  matchesTrend: boolean,
): { readonly state: PulseState; readonly reward: Reward } {
  if (!state.composer || text.trim().length === 0) {
    return { state, reward: NO_REWARD }
  }

  const onTrendReward =
    state.composer.mode === 'Reply'
      ? WINDOW_REWARDS.Pulse.ReplyOnTrend
      : WINDOW_REWARDS.Pulse.CreatePostOnTrend
  const reward = matchesTrend
    ? onTrendReward
    : {
        dopamine: onTrendReward.dopamine * 0.4,
        score: onTrendReward.score * 0.4,
      }
  const timeline =
    state.composer.mode === 'CreatePost'
      ? [
          {
            id: `player-${state.timeline.length + 1}`,
            userId: 'player',
            body: text,
            category: matchesTrend ? 'trend' : 'other',
            rewardable: true,
          },
          ...state.timeline,
        ]
      : state.timeline

  return {
    state: { ...state, timeline, composer: null },
    reward,
  }
}

export function raisePulseAttention(
  state: PulseState,
  kind: PulseAttentionKind,
  expiresAtMs: number,
): PulseState {
  return {
    ...state,
    attentionRequest: { kind, expiresAtMs },
  }
}

export function respondToPulseAttention(
  state: PulseState,
  nowMs: number,
): { readonly state: PulseState; readonly reward: Reward } {
  if (!state.attentionRequest || nowMs >= state.attentionRequest.expiresAtMs) {
    return { state: tickPulse(state, nowMs), reward: NO_REWARD }
  }

  return {
    state: { ...state, attentionRequest: null },
    reward: WINDOW_REWARDS.Pulse.Mention,
  }
}

export function tickPulse(state: PulseState, nowMs: number): PulseState {
  return state.attentionRequest && nowMs >= state.attentionRequest.expiresAtMs
    ? { ...state, attentionRequest: null }
    : state
}

export function pulseEventIntervalMs(eventIntervalMultiplier: number): number {
  if (
    !Number.isFinite(eventIntervalMultiplier) ||
    eventIntervalMultiplier <= 0
  ) {
    throw new RangeError('Event interval multiplier must be positive')
  }
  return EVENT_INTERVAL_EARLY_MS * eventIntervalMultiplier
}
