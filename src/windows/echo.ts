import { WINDOW_REWARDS } from '../config/balance'
import {
  buildAnticipationBonus,
  calculateInteractionGain,
  createAnticipationBonus,
  createDiminishingState,
  resetAnticipationBonus,
  type AnticipationBonus,
  type DiminishingState,
} from '../core/dopamine'
import type { Clock } from '../testing/clock'
import type { MediaPort } from '../testing/media'
import type { Reward } from './loop'

export type EchoItem = {
  readonly id: string
  readonly durationMs: number
  readonly highlightAtMs: number
}

export type EchoState = {
  readonly items: readonly EchoItem[]
  readonly currentIndex: number
  readonly currentItem: EchoItem
  readonly positionMs: number
  readonly lastTickAtMs: number
  readonly highlightLanded: boolean
  readonly anticipation: AnticipationBonus
  readonly diminishing: DiminishingState
  readonly subscribedItemIds: ReadonlySet<string>
}

export type EchoTickResult = {
  readonly state: EchoState
  readonly reward: Reward
  readonly highlightLanded: boolean
}

const NO_REWARD: Reward = { dopamine: 0, score: 0 }

export function createEcho(
  items: readonly EchoItem[],
  clock: Clock,
): EchoState {
  const currentItem = items[0]
  if (!currentItem) throw new Error('Echo requires at least one item')
  validateItem(currentItem)

  return {
    items,
    currentIndex: 0,
    currentItem,
    positionMs: 0,
    lastTickAtMs: clock.now(),
    highlightLanded: false,
    anticipation: createAnticipationBonus(),
    diminishing: createDiminishingState(),
    subscribedItemIds: new Set(),
  }
}

export function tickEcho(
  state: EchoState,
  clock: Clock,
): EchoTickResult {
  const now = clock.now()
  const deltaMs = now - state.lastTickAtMs
  if (deltaMs < 0) throw new RangeError('Echo clock cannot move backwards')
  if (deltaMs === 0 || state.highlightLanded) {
    return {
      state: { ...state, lastTickAtMs: now },
      reward: NO_REWARD,
      highlightLanded: false,
    }
  }

  const positionMs = Math.min(
    state.currentItem.durationMs,
    state.positionMs + deltaMs,
  )
  const anticipation = buildAnticipationBonus(
    state.anticipation,
    WINDOW_REWARDS.Echo.HighlightedMoment.dopamine,
  )
  const landed =
    state.positionMs < state.currentItem.highlightAtMs &&
    positionMs >= state.currentItem.highlightAtMs

  return landed
    ? {
        state: {
          ...state,
          positionMs,
          lastTickAtMs: now,
          highlightLanded: true,
          anticipation: resetAnticipationBonus(
            anticipation,
            'obtained',
          ),
        },
        reward: {
          dopamine:
            WINDOW_REWARDS.Echo.HighlightedMoment.dopamine +
            anticipation.value,
          score: WINDOW_REWARDS.Echo.HighlightedMoment.score,
        },
        highlightLanded: true,
      }
    : {
        state: {
          ...state,
          positionMs,
          lastTickAtMs: now,
          anticipation,
        },
        reward: NO_REWARD,
        highlightLanded: false,
      }
}

export async function nextEchoItem(
  state: EchoState,
  media: MediaPort,
  clock: Clock,
): Promise<{ readonly state: EchoState; readonly reward: Reward }> {
  const currentIndex = (state.currentIndex + 1) % state.items.length
  const currentItem = state.items[currentIndex]!
  validateItem(currentItem)
  await media.play(currentItem.id)

  return {
    state: {
      ...state,
      currentIndex,
      currentItem,
      positionMs: 0,
      lastTickAtMs: clock.now(),
      highlightLanded: false,
      anticipation: resetAnticipationBonus(state.anticipation, 'left'),
      diminishing: createDiminishingState(),
    },
    reward: WINDOW_REWARDS.Echo.ChangeContent,
  }
}

export function echoAction(
  state: EchoState,
  action: 'React' | 'Subscribe',
): { readonly state: EchoState; readonly reward: Reward } {
  if (
    action === 'Subscribe' &&
    state.subscribedItemIds.has(state.currentItem.id)
  ) {
    return { state, reward: NO_REWARD }
  }

  const baseReward = WINDOW_REWARDS.Echo[action]
  const calculated = calculateInteractionGain(state.diminishing, {
    systemId: 'Echo',
    targetId: `${state.currentItem.id}:${action}`,
    baseGain: baseReward.dopamine,
  })
  const multiplier = calculated.gain / baseReward.dopamine

  return {
    state: {
      ...state,
      diminishing: calculated.state,
      subscribedItemIds:
        action === 'Subscribe'
          ? new Set([
              ...state.subscribedItemIds,
              state.currentItem.id,
            ])
          : state.subscribedItemIds,
    },
    reward: {
      dopamine: calculated.gain,
      score: baseReward.score * multiplier,
    },
  }
}

function validateItem(item: EchoItem): void {
  if (!Number.isFinite(item.durationMs) || item.durationMs <= 0) {
    throw new RangeError(`Echo item ${item.id} needs positive duration`)
  }
  if (
    !Number.isFinite(item.highlightAtMs) ||
    item.highlightAtMs <= 0 ||
    item.highlightAtMs >= item.durationMs
  ) {
    throw new RangeError(`Echo item ${item.id} has invalid highlight`)
  }
}
