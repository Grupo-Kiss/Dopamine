import {
  FOCUS_CHAIN_FX_FLASH_LENGTH,
  FOCUS_CHAIN_FX_PARTICLES_LENGTH,
  FOCUS_CHAIN_FX_POPUP_LENGTH,
  FOCUS_CHAIN_FX_SHAKE_LENGTH,
  FOCUS_CHAIN_FX_SPECIAL_COLOR_LENGTH,
} from '../config/balance'

export type FocusChainFxIntent =
  | 'Popup'
  | 'Particles'
  | 'ScreenFlash'
  | 'CameraShake'
  | 'SpecialColor'
  | 'ColorFade'

export type FocusChainFx = {
  readonly tier: number
  readonly intents: readonly FocusChainFxIntent[]
  readonly intensity: number
}

const TIERS: readonly {
  readonly length: number
  readonly intent: FocusChainFxIntent
}[] = [
  { length: FOCUS_CHAIN_FX_POPUP_LENGTH, intent: 'Popup' },
  { length: FOCUS_CHAIN_FX_PARTICLES_LENGTH, intent: 'Particles' },
  { length: FOCUS_CHAIN_FX_FLASH_LENGTH, intent: 'ScreenFlash' },
  { length: FOCUS_CHAIN_FX_SHAKE_LENGTH, intent: 'CameraShake' },
  { length: FOCUS_CHAIN_FX_SPECIAL_COLOR_LENGTH, intent: 'SpecialColor' },
]

const MOTION_HEAVY: ReadonlySet<FocusChainFxIntent> = new Set([
  'ScreenFlash',
  'CameraShake',
])

export const SCREEN_FX_INTENTS: ReadonlySet<FocusChainFxIntent> = new Set([
  'ScreenFlash',
  'CameraShake',
  'SpecialColor',
])

export function focusChainFx(
  length: number,
  options: { readonly accessibilityMode?: boolean } = {},
): FocusChainFx {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError('Focus Chain length must be a non-negative integer')
  }

  const reached = TIERS.filter((tier) => length >= tier.length)
  const tier = reached.at(-1)?.length ?? 0
  const intensity = reached.length / TIERS.length
  const intents = reached.map((entry) => entry.intent)

  return {
    tier,
    intensity,
    intents: options.accessibilityMode ? reduceMotion(intents) : intents,
  }
}

function reduceMotion(
  intents: readonly FocusChainFxIntent[],
): FocusChainFxIntent[] {
  const calm = intents.filter((intent) => !MOTION_HEAVY.has(intent))
  if (calm.length === intents.length) return calm

  const fadeAt = calm.indexOf('SpecialColor')
  if (fadeAt === -1) return [...calm, 'ColorFade']
  return [...calm.slice(0, fadeAt), 'ColorFade', ...calm.slice(fadeAt)]
}
