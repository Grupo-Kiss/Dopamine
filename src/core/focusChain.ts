import {
  CHAIN_COMPLETION_DOPAMINE_PER_STEP,
  CHAIN_COMPLETION_SCORE_PER_STEP,
  FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS,
  FOCUS_CHAIN_STEP_BONUSES,
  FOCUS_CHAIN_TIMEOUT_BASE_MS,
  FOCUS_CHAIN_TIMEOUT_DECAY_MS,
  FOCUS_CHAIN_TIMEOUT_MIN_MS,
} from '../config/balance'

export type ActiveWindow = string
export type FocusDestinationState =
  'Normal' | 'Waiting' | 'FocusReady' | 'AttentionRequest'
export type FocusQuality = 'Poor' | 'Good' | 'Excellent' | 'Perfect'

export type FocusChain = {
  readonly activeWindow: ActiveWindow | null
  readonly length: number
  readonly expiresAtMs: number | null
}

export type FocusInteraction = {
  readonly atMs: number
  readonly destination: ActiveWindow
  readonly destinationState: FocusDestinationState
  readonly timing?: 'Standard' | 'Tight'
  readonly valid: boolean
}

export type FocusBonus = {
  readonly dopamine: number
  readonly score: number
}

export type FocusInteractionResult = {
  readonly chain: FocusChain
  readonly extended: boolean
  readonly quality: FocusQuality | null
  readonly stepBonus: FocusBonus
  readonly completionBonus: FocusBonus
}

export type FocusChainEndResult = {
  readonly chain: FocusChain
  readonly completionBonus: FocusBonus
}

const NO_BONUS: FocusBonus = { dopamine: 0, score: 0 }

export function createFocusChain(
  activeWindow: ActiveWindow | null = null,
): FocusChain {
  return {
    activeWindow,
    length: 0,
    expiresAtMs: null,
  }
}

export function handleFocusInteraction(
  currentChain: FocusChain,
  interaction: FocusInteraction,
): FocusInteractionResult {
  if (!interaction.valid) {
    return unchangedInteraction(currentChain)
  }

  const chain =
    currentChain.expiresAtMs !== null &&
    interaction.atMs >= currentChain.expiresAtMs
      ? breakFocusChain(currentChain).chain
      : currentChain

  if (interaction.destination === chain.activeWindow) {
    return unchangedInteraction(chain)
  }

  if (interaction.destinationState === 'Waiting') {
    const ended = breakFocusChain(chain)
    return {
      chain: {
        ...ended.chain,
        activeWindow: interaction.destination,
      },
      extended: false,
      quality: null,
      stepBonus: NO_BONUS,
      completionBonus: ended.completionBonus,
    }
  }

  const length = chain.length + 1
  const quality = qualityFor(interaction)

  return {
    chain: {
      activeWindow: interaction.destination,
      length,
      expiresAtMs: interaction.atMs + focusChainTimeoutMs(length),
    },
    extended: true,
    quality,
    stepBonus: stepBonusFor(length),
    completionBonus: NO_BONUS,
  }
}

export function focusChainTimeoutMs(length: number): number {
  if (!Number.isSafeInteger(length) || length < 1) {
    throw new RangeError('Focus Chain length must be a positive integer')
  }

  return Math.max(
    FOCUS_CHAIN_TIMEOUT_MIN_MS,
    FOCUS_CHAIN_TIMEOUT_BASE_MS - (length - 1) * FOCUS_CHAIN_TIMEOUT_DECAY_MS,
  )
}

export function expireFocusChain(
  chain: FocusChain,
  nowMs: number,
): FocusChainEndResult {
  if (chain.expiresAtMs === null || nowMs < chain.expiresAtMs) {
    return { chain, completionBonus: NO_BONUS }
  }

  return breakFocusChain(chain)
}

export function breakFocusChain(chain: FocusChain): FocusChainEndResult {
  const eligible = chain.length >= FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS
  const completionBonus = eligible
    ? {
        dopamine: chain.length * CHAIN_COMPLETION_DOPAMINE_PER_STEP,
        score: chain.length * CHAIN_COMPLETION_SCORE_PER_STEP,
      }
    : NO_BONUS

  return {
    chain: {
      activeWindow: chain.activeWindow,
      length: 0,
      expiresAtMs: null,
    },
    completionBonus,
  }
}

export function hoverWindow(
  chain: FocusChain,
  _window: ActiveWindow,
): FocusChain {
  return chain
}

function unchangedInteraction(chain: FocusChain): FocusInteractionResult {
  return {
    chain,
    extended: false,
    quality: null,
    stepBonus: NO_BONUS,
    completionBonus: NO_BONUS,
  }
}

function qualityFor(interaction: FocusInteraction): FocusQuality {
  if (
    interaction.destinationState === 'AttentionRequest' &&
    interaction.timing === 'Tight'
  ) {
    return 'Perfect'
  }

  if (interaction.destinationState === 'AttentionRequest') {
    return 'Excellent'
  }

  if (interaction.destinationState === 'FocusReady') {
    return 'Good'
  }

  return 'Poor'
}

function stepBonusFor(length: number): FocusBonus {
  const tiers = Object.keys(FOCUS_CHAIN_STEP_BONUSES)
    .map(Number)
    .sort((left, right) => right - left)
  const tier = tiers.find((candidate) => length >= candidate) ?? 1

  return FOCUS_CHAIN_STEP_BONUSES[tier as keyof typeof FOCUS_CHAIN_STEP_BONUSES]
}
