import {
  BURNOUT_APM_THRESHOLD_1,
  BURNOUT_APM_THRESHOLD_2,
  BURNOUT_APM_THRESHOLD_3,
  BURNOUT_APM_THRESHOLD_GROWTH,
  BURNOUT_ENTER_SUSTAIN_MS,
  BURNOUT_EXIT_BELOW_MS,
  BURNOUT_REWARD_MULT,
  BURNOUT_TELEGRAPH_APM_RATIO,
  DOPAMINE_DRAIN_RECOVERY_MULT,
  RECOVERY_DURATION_MS,
} from '../config/balance'
import type { Clock } from '../testing/clock'

const APM_WINDOW_MS = 60_000

export type ApmTracker = {
  readonly actionTimesMs: readonly number[]
}

export type BurnoutMode = 'Playing' | 'Burnout' | 'Recovery'

export type BurnoutSystem = {
  readonly mode: BurnoutMode
  readonly apmTracker: ApmTracker
  readonly apm: number
  readonly thresholdApm: number
  readonly completedRecoveries: number
  readonly telegraphActive: boolean
  readonly aboveThresholdSinceMs: number | null
  readonly belowThresholdSinceMs: number | null
  readonly recoveryEndsAtMs: number | null
  readonly rewardMultiplier: number
  readonly dopamineDrainMultiplier: number
}

export function createApmTracker(): ApmTracker {
  return { actionTimesMs: [] }
}

export function recordAction(
  tracker: ApmTracker,
  clock: Clock,
): ApmTracker {
  return {
    actionTimesMs: [...recentActionTimes(tracker, clock), clock.now()],
  }
}

export function actionsPerMinute(
  tracker: ApmTracker,
  clock: Clock,
): number {
  return recentActionTimes(tracker, clock).length
}

export function createBurnoutSystem(_clock: Clock): BurnoutSystem {
  return {
    mode: 'Playing',
    apmTracker: createApmTracker(),
    apm: 0,
    thresholdApm: BURNOUT_APM_THRESHOLD_1,
    completedRecoveries: 0,
    telegraphActive: false,
    aboveThresholdSinceMs: null,
    belowThresholdSinceMs: null,
    recoveryEndsAtMs: null,
    rewardMultiplier: 1,
    dopamineDrainMultiplier: 1,
  }
}

export function tickBurnout(
  system: BurnoutSystem,
  clock: Clock,
): BurnoutSystem {
  const now = clock.now()
  const apm = actionsPerMinute(system.apmTracker, clock)
  const apmTracker = {
    actionTimesMs: recentActionTimes(system.apmTracker, clock),
  }

  if (system.mode === 'Recovery') {
    if (system.recoveryEndsAtMs !== null && now >= system.recoveryEndsAtMs) {
      const completedRecoveries = system.completedRecoveries + 1
      return {
        ...system,
        mode: 'Playing',
        apmTracker,
        apm,
        thresholdApm: thresholdAfterCompletedRecoveries(completedRecoveries),
        completedRecoveries,
        telegraphActive:
          apm >=
          thresholdAfterCompletedRecoveries(completedRecoveries) *
            BURNOUT_TELEGRAPH_APM_RATIO,
        aboveThresholdSinceMs: null,
        belowThresholdSinceMs: null,
        recoveryEndsAtMs: null,
        rewardMultiplier: 1,
        dopamineDrainMultiplier: 1,
      }
    }

    return {
      ...system,
      apmTracker,
      apm,
      telegraphActive: false,
      rewardMultiplier: 1,
      dopamineDrainMultiplier: DOPAMINE_DRAIN_RECOVERY_MULT,
    }
  }

  if (system.mode === 'Burnout') {
    const belowThresholdSinceMs =
      apm < system.thresholdApm
        ? (system.belowThresholdSinceMs ?? now)
        : null

    if (
      belowThresholdSinceMs !== null &&
      now - belowThresholdSinceMs >= BURNOUT_EXIT_BELOW_MS
    ) {
      return {
        ...system,
        mode: 'Recovery',
        apmTracker,
        apm,
        telegraphActive: false,
        aboveThresholdSinceMs: null,
        belowThresholdSinceMs: null,
        recoveryEndsAtMs: now + RECOVERY_DURATION_MS,
        rewardMultiplier: 1,
        dopamineDrainMultiplier: DOPAMINE_DRAIN_RECOVERY_MULT,
      }
    }

    return {
      ...system,
      apmTracker,
      apm,
      telegraphActive: false,
      belowThresholdSinceMs,
      rewardMultiplier: BURNOUT_REWARD_MULT,
      dopamineDrainMultiplier: 1,
    }
  }

  const aboveThresholdSinceMs =
    apm >= system.thresholdApm
      ? (system.aboveThresholdSinceMs ?? now)
      : null

  if (
    aboveThresholdSinceMs !== null &&
    now - aboveThresholdSinceMs >= BURNOUT_ENTER_SUSTAIN_MS
  ) {
    return {
      ...system,
      mode: 'Burnout',
      apmTracker,
      apm,
      telegraphActive: false,
      aboveThresholdSinceMs: null,
      belowThresholdSinceMs: null,
      rewardMultiplier: BURNOUT_REWARD_MULT,
      dopamineDrainMultiplier: 1,
    }
  }

  return {
    ...system,
    apmTracker,
    apm,
    telegraphActive:
      apm >= system.thresholdApm * BURNOUT_TELEGRAPH_APM_RATIO,
    aboveThresholdSinceMs,
    rewardMultiplier: 1,
    dopamineDrainMultiplier: 1,
  }
}

export function thresholdAfterCompletedRecoveries(
  completedRecoveries: number,
): number {
  if (
    !Number.isSafeInteger(completedRecoveries) ||
    completedRecoveries < 0
  ) {
    throw new RangeError('Completed Recoveries must be a non-negative integer')
  }

  if (completedRecoveries === 0) {
    return BURNOUT_APM_THRESHOLD_1
  }
  if (completedRecoveries === 1) {
    return BURNOUT_APM_THRESHOLD_2
  }
  if (completedRecoveries === 2) {
    return BURNOUT_APM_THRESHOLD_3
  }

  return (
    BURNOUT_APM_THRESHOLD_3 *
    BURNOUT_APM_THRESHOLD_GROWTH ** (completedRecoveries - 2)
  )
}

function recentActionTimes(
  tracker: ApmTracker,
  clock: Clock,
): readonly number[] {
  const cutoff = clock.now() - APM_WINDOW_MS
  return tracker.actionTimesMs.filter((time) => time > cutoff)
}
