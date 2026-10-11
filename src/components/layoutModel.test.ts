import { createSequenceRng } from '../testing/rng'
import {
  createDesktopLayout,
  createMobileLayout,
  SERVICE_WINDOWS,
} from './layoutModel'

describe('layout model', () => {
  it('reserves five Desktop windows and keeps HUD outside masonry', () => {
    const model = createDesktopLayout({
      minigameSide: 'left',
      bottomOrder: ['Pulse', 'Echo'],
    })

    expect(model.permanentWindows).toEqual([
      'Minigame',
      'Loop',
      'Pulse',
      'Wave',
      'Echo',
    ])
    expect(model.dopamineBar).toEqual({ placement: 'outsideMasonry' })
    expect(model.alerts).toEqual({ placement: 'overlay' })
    expect(model.permanentWindows).not.toContain('Alerts')
  })

  it('preserves Desktop structural pairs under allowed shuffle', () => {
    const model = createDesktopLayout({
      minigameSide: 'right',
      bottomOrder: ['Echo', 'Pulse'],
    })

    expect(model.topBand).toEqual([
      { kind: 'ServiceStack', windows: ['Loop', 'Wave'] },
      { kind: 'Window', window: 'Minigame' },
    ])
    expect(model.bottomBand).toEqual(['Echo', 'Pulse'])
    expect(model.gutterPx).toBeGreaterThan(0)
    expect(model.outerInsetPx).toBeGreaterThan(0)
  })

  it('selects exactly two Mobile services without replacement', () => {
    const model = createMobileLayout(createSequenceRng([0.1, 0.6]))

    expect(model.windows).toEqual(['Minigame', 'Loop', 'Wave'])
    expect(new Set(model.windows).size).toBe(3)
    expect(model.windows.filter((window) => window !== 'Minigame')).toHaveLength(
      2,
    )
    expect(
      model.windows
        .filter((window) => window !== 'Minigame')
        .every((window) => SERVICE_WINDOWS.includes(window)),
    ).toBe(true)
    expect(model.windows.indexOf('Loop')).toBeLessThan(
      model.windows.indexOf('Wave'),
    )
  })
})
