import {
  COMBO_STICKER_BORED_OPACITY,
  COMBO_STICKER_BORED_SATURATION,
  COMBO_STICKER_JUICY_OVERSHOOT,
  COMBO_STICKER_JUICY_SCALE,
} from '../config/balance'
import { diminishingMultiplier } from '../core/dopamine'
import { comboJuice, comboLabel } from './comboJuice'

describe('feel: Combo sticker boredom curve', () => {
  it('pins the 06 readability knobs', () => {
    expect({
      COMBO_STICKER_JUICY_SCALE,
      COMBO_STICKER_JUICY_OVERSHOOT,
      COMBO_STICKER_BORED_SATURATION,
      COMBO_STICKER_BORED_OPACITY,
    }).toEqual({
      COMBO_STICKER_JUICY_SCALE: 1.35,
      COMBO_STICKER_JUICY_OVERSHOOT: 0.3,
      COMBO_STICKER_BORED_SATURATION: 0.35,
      COMBO_STICKER_BORED_OPACITY: 0.85,
    })
  })

  it('repeated same-window combo intensity decreases while remaining readable', () => {
    const juices = Array.from({ length: 200 }, (_, index) =>
      comboJuice(index + 1),
    )

    for (let index = 1; index < juices.length; index += 1) {
      const previous = juices[index - 1]
      const current = juices[index]
      expect(current.juiciness).toBeLessThanOrEqual(previous.juiciness)
      expect(current.scale).toBeLessThanOrEqual(previous.scale)
      expect(current.saturation).toBeLessThanOrEqual(previous.saturation)
    }
    expect(juices[1].juiciness).toBeLessThan(juices[0].juiciness)

    for (const juice of juices) {
      expect(juice.scale).toBeGreaterThanOrEqual(1)
      expect(juice.opacity).toBeGreaterThanOrEqual(COMBO_STICKER_BORED_OPACITY)
      expect(juice.saturation).toBeGreaterThanOrEqual(
        COMBO_STICKER_BORED_SATURATION,
      )
    }
  })

  it('is fully juicy on the first hit', () => {
    expect(comboJuice(1)).toEqual({
      juiciness: 1,
      scale: COMBO_STICKER_JUICY_SCALE,
      overshoot: COMBO_STICKER_JUICY_OVERSHOOT,
      saturation: 1,
      opacity: 1,
      emphasis: '!!',
    })
  })

  it('wires juiciness to the normalized diminishing multiplier', () => {
    for (const repeats of [1, 2, 3, 5, 8, 40]) {
      const floor = diminishingMultiplier(Number.MAX_SAFE_INTEGER)
      const expected = (diminishingMultiplier(repeats) - floor) / (1 - floor)
      expect(comboJuice(repeats).juiciness).toBeCloseTo(expected, 10)
    }
  })

  it('bottoms out at the bored floor once diminishing returns hit their floor', () => {
    const bored = comboJuice(Number.MAX_SAFE_INTEGER)
    expect(bored).toEqual({
      juiciness: 0,
      scale: 1,
      overshoot: 0,
      saturation: COMBO_STICKER_BORED_SATURATION,
      opacity: COMBO_STICKER_BORED_OPACITY,
      emphasis: '',
    })
  })

  it('flattens the label from xN!! to bare xN but always shows the multiplier', () => {
    expect(comboLabel(2.5, comboJuice(1))).toBe('x2.5!!')
    expect(comboLabel(2.5, comboJuice(Number.MAX_SAFE_INTEGER))).toBe('x2.5')
    const emphases = new Set(
      Array.from({ length: 200 }, (_, index) => comboJuice(index + 1).emphasis),
    )
    expect(emphases).toEqual(new Set(['!!', '!', '']))
  })

  it('drops pop overshoot in Accessibility Mode but keeps the boredom curve', () => {
    const reduced = comboJuice(1, { accessibilityMode: true })
    expect(reduced.overshoot).toBe(0)
    expect(reduced.saturation).toBe(1)
    expect(comboJuice(30, { accessibilityMode: true }).saturation).toBe(
      comboJuice(30).saturation,
    )
  })

  it('rejects non-positive repeat counts', () => {
    expect(() => comboJuice(0)).toThrow(RangeError)
  })
})
