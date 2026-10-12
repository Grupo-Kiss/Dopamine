import {
  COMBO_STICKER_BORED_OPACITY,
  COMBO_STICKER_BORED_SATURATION,
  COMBO_STICKER_JUICY_OVERSHOOT,
  COMBO_STICKER_JUICY_SCALE,
  DIMINISH_FLOOR_MULT,
} from '../config/balance'
import { diminishingMultiplier } from '../core/dopamine'

export type ComboEmphasis = '!!' | '!' | ''

export type ComboJuice = {
  readonly juiciness: number
  readonly scale: number
  readonly overshoot: number
  readonly saturation: number
  readonly opacity: number
  readonly emphasis: ComboEmphasis
}

const DOUBLE_EMPHASIS_FROM = 0.6
const SINGLE_EMPHASIS_FROM = 0.3

export function comboJuice(
  repeatedInteractions: number,
  options: { readonly accessibilityMode?: boolean } = {},
): ComboJuice {
  const juiciness =
    (diminishingMultiplier(repeatedInteractions) - DIMINISH_FLOOR_MULT) /
    (1 - DIMINISH_FLOOR_MULT)

  return {
    juiciness,
    scale: lerp(1, COMBO_STICKER_JUICY_SCALE, juiciness),
    overshoot: options.accessibilityMode
      ? 0
      : lerp(0, COMBO_STICKER_JUICY_OVERSHOOT, juiciness),
    saturation: lerp(COMBO_STICKER_BORED_SATURATION, 1, juiciness),
    opacity: lerp(COMBO_STICKER_BORED_OPACITY, 1, juiciness),
    emphasis:
      juiciness >= DOUBLE_EMPHASIS_FROM
        ? '!!'
        : juiciness >= SINGLE_EMPHASIS_FROM
          ? '!'
          : '',
  }
}

export function comboLabel(multiplier: number, juice: ComboJuice): string {
  return `x${multiplier}${juice.emphasis}`
}

function lerp(bored: number, juicy: number, juiciness: number): number {
  return bored + (juicy - bored) * juiciness
}
