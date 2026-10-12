import {
  FOCUS_CHAIN_FX_FLASH_LENGTH,
  FOCUS_CHAIN_FX_PARTICLES_LENGTH,
  FOCUS_CHAIN_FX_POPUP_LENGTH,
  FOCUS_CHAIN_FX_SHAKE_LENGTH,
  FOCUS_CHAIN_FX_SPECIAL_COLOR_LENGTH,
} from '../config/balance'
import { focusChainFx } from './focusChainFx'

describe('feel: Focus Chain visual progression', () => {
  it('pins the 02 Visual Progression lengths in balance', () => {
    expect([
      FOCUS_CHAIN_FX_POPUP_LENGTH,
      FOCUS_CHAIN_FX_PARTICLES_LENGTH,
      FOCUS_CHAIN_FX_FLASH_LENGTH,
      FOCUS_CHAIN_FX_SHAKE_LENGTH,
      FOCUS_CHAIN_FX_SPECIAL_COLOR_LENGTH,
    ]).toEqual([3, 5, 10, 15, 20])
  })

  it('chain length thresholds emit escalating FX intents (popup→particles→flash→shake→color)', () => {
    expect(focusChainFx(1).intents).toEqual([])
    expect(focusChainFx(2).intents).toEqual([])
    expect(focusChainFx(3).intents).toEqual(['Popup'])
    expect(focusChainFx(5).intents).toEqual(['Popup', 'Particles'])
    expect(focusChainFx(10).intents).toEqual([
      'Popup',
      'Particles',
      'ScreenFlash',
    ])
    expect(focusChainFx(15).intents).toEqual([
      'Popup',
      'Particles',
      'ScreenFlash',
      'CameraShake',
    ])
    expect(focusChainFx(20).intents).toEqual([
      'Popup',
      'Particles',
      'ScreenFlash',
      'CameraShake',
      'SpecialColor',
    ])
  })

  it('reports the tier reached and keeps 20+ at the top tier', () => {
    expect(
      [1, 3, 4, 5, 9, 10, 14, 15, 19, 20, 50].map(
        (length) => focusChainFx(length).tier,
      ),
    ).toEqual([0, 3, 3, 5, 5, 10, 10, 15, 15, 20, 20])
    expect(focusChainFx(50).intents).toEqual(focusChainFx(20).intents)
  })

  it('never de-escalates as the chain grows', () => {
    let previous = focusChainFx(1)
    for (let length = 2; length <= 30; length += 1) {
      const current = focusChainFx(length)
      expect(current.intensity).toBeGreaterThanOrEqual(previous.intensity)
      expect(current.intents).toEqual(
        expect.arrayContaining([...previous.intents]),
      )
      previous = current
    }
    expect(focusChainFx(1).intensity).toBe(0)
    expect(focusChainFx(20).intensity).toBe(1)
  })

  it('swaps flash and shake for a colour fade in Accessibility Mode without hiding the tier', () => {
    const reduced = focusChainFx(20, { accessibilityMode: true })

    expect(reduced.tier).toBe(20)
    expect(reduced.intents).toEqual([
      'Popup',
      'Particles',
      'ColorFade',
      'SpecialColor',
    ])
    expect(reduced.intents).not.toContain('CameraShake')
    expect(reduced.intents).not.toContain('ScreenFlash')
    expect(focusChainFx(5, { accessibilityMode: true }).intents).toEqual([
      'Popup',
      'Particles',
    ])
  })

  it('rejects non-integer or negative chain lengths', () => {
    expect(() => focusChainFx(-1)).toThrow(RangeError)
    expect(() => focusChainFx(2.5)).toThrow(RangeError)
  })
})
