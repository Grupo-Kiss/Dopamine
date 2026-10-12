import {
  ATTENTION_REQUEST_DURATION_EARLY_MS,
  ATTENTION_REQUEST_DURATION_LATE_MS,
  DIFFICULTY_CURVE_EXPONENT,
  DIFFICULTY_TIME_TO_MAX_MS,
  DOPAMINE_DRAIN_DIFFICULTY_MULT_MAX,
  DOPAMINE_DRAIN_DIFFICULTY_MULT_MIN,
  EVENT_INTERVAL_EARLY_MS,
  EVENT_INTERVAL_LATE_MS,
} from '../config/balance'

export type Difficulty = {
  readonly elapsedMs: number
  readonly progress: number
  readonly dopamineDrainMultiplier: number
}

export type PressureMultipliers = {
  readonly eventIntervalMultiplier: number
  readonly attentionRequestDurationMultiplier: number
}

export function difficultyAt(elapsedMs: number): Difficulty {
  assertElapsedTime(elapsedMs)

  const normalizedTime = Math.min(1, elapsedMs / DIFFICULTY_TIME_TO_MAX_MS)
  const progress = normalizedTime ** DIFFICULTY_CURVE_EXPONENT

  return {
    elapsedMs,
    progress,
    dopamineDrainMultiplier: interpolate(
      DOPAMINE_DRAIN_DIFFICULTY_MULT_MIN,
      DOPAMINE_DRAIN_DIFFICULTY_MULT_MAX,
      progress,
    ),
  }
}

export function pressureMultipliersAt(elapsedMs: number): PressureMultipliers {
  const { progress } = difficultyAt(elapsedMs)

  return {
    eventIntervalMultiplier: interpolate(
      1,
      EVENT_INTERVAL_LATE_MS / EVENT_INTERVAL_EARLY_MS,
      progress,
    ),
    attentionRequestDurationMultiplier: interpolate(
      1,
      ATTENTION_REQUEST_DURATION_LATE_MS / ATTENTION_REQUEST_DURATION_EARLY_MS,
      progress,
    ),
  }
}

function interpolate(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

function assertElapsedTime(elapsedMs: number): void {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    throw new RangeError('Match elapsed time must be finite and non-negative')
  }
}
