import {
  ANTICIPATION_CAP_VS_DIRECT_MULT,
  ANTICIPATION_LOG_BASE,
  ANTICIPATION_STEP_DOPAMINE,
  DOPAMINE_DRAIN_PER_SECOND_BASE,
  DOPAMINE_DRAIN_RECOVERY_MULT,
  DOPAMINE_MAX,
  DOPAMINE_MIN,
  DIMINISH_FLOOR_MULT,
  DIMINISH_LOG_BASE,
} from '../config/balance'
import type { Clock } from '../testing/clock'

export type DopamineMeter = {
  readonly value: number
  readonly lastTickAtMs: number
}

export type DopamineTickOptions = {
  readonly difficultyMultiplier: number
  readonly recovery: boolean
}

export type DiminishingState = {
  readonly systemId: string | null
  readonly targetId: string | null
  readonly repeatedInteractions: number
}

export type InteractionGain = {
  readonly systemId: string
  readonly targetId: string
  readonly baseGain: number
}

export type AnticipationBonus = {
  readonly kind: 'AnticipationBonus'
  readonly steps: number
  readonly value: number
}

export type AnticipationResetReason = 'obtained' | 'left' | 'expired'

export function createDopamineMeter(clock: Clock): DopamineMeter {
  return {
    value: DOPAMINE_MAX,
    lastTickAtMs: clock.now(),
  }
}

export function tickDopamine(
  meter: DopamineMeter,
  clock: Clock,
  options: DopamineTickOptions,
): DopamineMeter {
  assertNonNegativeFinite(options.difficultyMultiplier, 'Difficulty multiplier')

  const now = clock.now()
  const elapsedMs = now - meter.lastTickAtMs
  assertNonNegativeFinite(elapsedMs, 'Elapsed time')

  const recoveryMultiplier = options.recovery ? DOPAMINE_DRAIN_RECOVERY_MULT : 1
  const drain =
    (elapsedMs / 1_000) *
    DOPAMINE_DRAIN_PER_SECOND_BASE *
    options.difficultyMultiplier *
    recoveryMultiplier

  return {
    value: clampDopamine(meter.value - drain),
    lastTickAtMs: now,
  }
}

export function grantDopamine(
  meter: DopamineMeter,
  amount: number,
): DopamineMeter {
  assertNonNegativeFinite(amount, 'Dopamine gain')

  if (amount === 0) {
    return meter
  }

  return {
    ...meter,
    value: clampDopamine(meter.value + amount),
  }
}

export function createDiminishingState(): DiminishingState {
  return {
    systemId: null,
    targetId: null,
    repeatedInteractions: 0,
  }
}

export function calculateInteractionGain(
  state: DiminishingState,
  interaction: InteractionGain,
): { readonly state: DiminishingState; readonly gain: number } {
  assertNonNegativeFinite(interaction.baseGain, 'Base Dopamine gain')

  const sameTarget =
    state.systemId === interaction.systemId &&
    state.targetId === interaction.targetId
  const repeatedInteractions = sameTarget ? state.repeatedInteractions + 1 : 1

  return {
    state: {
      systemId: interaction.systemId,
      targetId: interaction.targetId,
      repeatedInteractions,
    },
    gain: interaction.baseGain * diminishingMultiplier(repeatedInteractions),
  }
}

export function diminishingMultiplier(repeatedInteractions: number): number {
  if (!Number.isSafeInteger(repeatedInteractions) || repeatedInteractions < 1) {
    throw new RangeError('Repeated interactions must be a positive integer')
  }

  const logarithmicMultiplier =
    1 /
    (Math.log(repeatedInteractions + DIMINISH_LOG_BASE - 1) /
      Math.log(DIMINISH_LOG_BASE))

  return Math.max(DIMINISH_FLOOR_MULT, logarithmicMultiplier)
}

export function createAnticipationBonus(): AnticipationBonus {
  return {
    kind: 'AnticipationBonus',
    steps: 0,
    value: 0,
  }
}

export function buildAnticipationBonus(
  bonus: AnticipationBonus,
  comparableDirectReward: number,
): AnticipationBonus {
  assertNonNegativeFinite(comparableDirectReward, 'Comparable direct reward')

  const steps = bonus.steps + 1
  const logarithmicValue =
    ANTICIPATION_STEP_DOPAMINE *
    (Math.log(steps + ANTICIPATION_LOG_BASE - 1) /
      Math.log(ANTICIPATION_LOG_BASE))
  const cap = comparableDirectReward * ANTICIPATION_CAP_VS_DIRECT_MULT

  return {
    kind: 'AnticipationBonus',
    steps,
    value: Math.min(cap, logarithmicValue),
  }
}

export function resetAnticipationBonus(
  _bonus: AnticipationBonus,
  _reason: AnticipationResetReason,
): AnticipationBonus {
  return createAnticipationBonus()
}

function clampDopamine(value: number): number {
  return Math.min(DOPAMINE_MAX, Math.max(DOPAMINE_MIN, value))
}

function assertNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} cannot be negative or non-finite`)
  }
}
