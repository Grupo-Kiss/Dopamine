import {
  handleFocusInteraction,
  type ActiveWindow,
  type FocusChain,
} from '../core/focusChain'
import type { InputHandler } from '../core/input'
import type { Reward } from './loop'

export type AlertPriority = 'Low' | 'Normal' | 'High' | 'Critical'
export type AlertCategory = 'valuable' | 'spam' | 'system'

export type Alert = {
  readonly id: string
  readonly message: string
  readonly priority: AlertPriority
  readonly category: AlertCategory
  readonly reward: Reward
  readonly destination?: ActiveWindow
  readonly expiresAtMs: number
}

export type AlertsState = {
  readonly pending: readonly Alert[]
  readonly activeAlert: Alert | null
}

const NO_REWARD: Reward = { dopamine: 0, score: 0 }
const PRIORITY: Readonly<Record<AlertPriority, number>> = {
  Low: 0,
  Normal: 1,
  High: 2,
  Critical: 3,
}

export function createAlerts(alerts: readonly Alert[] = []): AlertsState {
  return { pending: [...alerts], activeAlert: null }
}

export function createAlertInputHandler(state: AlertsState): InputHandler {
  return (code) =>
    state.activeAlert || state.pending.length > 0
      ? { type: 'Handled', layer: 'Alert', code }
      : null
}

export function openHighestPriorityAlert(
  initialState: AlertsState,
  focusChain: FocusChain,
  nowMs: number,
): {
  readonly state: AlertsState
  readonly focusChain: FocusChain
  readonly reward: Reward
} {
  const state = expireAlerts(initialState, nowMs)
  const highest = [...state.pending].sort(
    (left, right) => PRIORITY[right.priority] - PRIORITY[left.priority],
  )[0]

  if (!highest) {
    return { state, focusChain, reward: NO_REWARD }
  }

  const nextFocusChain = highest.destination
    ? handleFocusInteraction(focusChain, {
        atMs: nowMs,
        destination: highest.destination,
        destinationState: 'AttentionRequest',
        valid: true,
      }).chain
    : focusChain

  return {
    state: {
      pending: state.pending.filter((alert) => alert.id !== highest.id),
      activeAlert: highest,
    },
    focusChain: nextFocusChain,
    reward: highest.category === 'spam' ? NO_REWARD : highest.reward,
  }
}

export function dismissActiveAlert(state: AlertsState): AlertsState {
  return { ...state, activeAlert: null }
}

export function expireAlerts(
  state: AlertsState,
  nowMs: number,
): AlertsState {
  return {
    pending: state.pending.filter((alert) => nowMs < alert.expiresAtMs),
    activeAlert:
      state.activeAlert && nowMs < state.activeAlert.expiresAtMs
        ? state.activeAlert
        : null,
  }
}
