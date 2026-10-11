import {
  LAYOUT_GUTTER_PX,
  LAYOUT_OUTER_INSET_PX,
} from '../config/layout'
import type { Rng } from '../testing/rng'

export const SERVICE_WINDOWS = [
  'Loop',
  'Pulse',
  'Wave',
  'Echo',
] as const

export type ServiceWindow = (typeof SERVICE_WINDOWS)[number]
export type PermanentWindow = 'Minigame' | ServiceWindow

export type DesktopShuffle = {
  readonly minigameSide: 'left' | 'right'
  readonly bottomOrder:
    | readonly ['Pulse', 'Echo']
    | readonly ['Echo', 'Pulse']
}

export type DesktopLayout = {
  readonly kind: 'Desktop'
  readonly permanentWindows: readonly [
    'Minigame',
    'Loop',
    'Pulse',
    'Wave',
    'Echo',
  ]
  readonly topBand:
    | readonly [
        { readonly kind: 'Window'; readonly window: 'Minigame' },
        {
          readonly kind: 'ServiceStack'
          readonly windows: readonly ['Loop', 'Wave']
        },
      ]
    | readonly [
        {
          readonly kind: 'ServiceStack'
          readonly windows: readonly ['Loop', 'Wave']
        },
        { readonly kind: 'Window'; readonly window: 'Minigame' },
      ]
  readonly bottomBand:
    | readonly ['Pulse', 'Echo']
    | readonly ['Echo', 'Pulse']
  readonly dopamineBar: { readonly placement: 'outsideMasonry' }
  readonly alerts: { readonly placement: 'overlay' }
  readonly gutterPx: number
  readonly outerInsetPx: number
}

export type MobileLayout = {
  readonly kind: 'Mobile'
  readonly windows: readonly [
    'Minigame',
    ServiceWindow,
    ServiceWindow,
  ]
  readonly dopamineBar: { readonly placement: 'outsideMasonry' }
  readonly alerts: { readonly placement: 'overlay' }
  readonly gutterPx: number
  readonly outerInsetPx: number
}

export type LayoutModel = DesktopLayout | MobileLayout

const SERVICE_PRIORITY: Readonly<Record<ServiceWindow, number>> = {
  Loop: 2,
  Pulse: 3,
  Echo: 3,
  Wave: 4,
}

export function createDesktopLayout(
  shuffle: DesktopShuffle,
): DesktopLayout {
  const minigame = { kind: 'Window', window: 'Minigame' } as const
  const services = {
    kind: 'ServiceStack',
    windows: ['Loop', 'Wave'],
  } as const

  return {
    kind: 'Desktop',
    permanentWindows: ['Minigame', 'Loop', 'Pulse', 'Wave', 'Echo'],
    topBand:
      shuffle.minigameSide === 'left'
        ? [minigame, services]
        : [services, minigame],
    bottomBand: shuffle.bottomOrder,
    dopamineBar: { placement: 'outsideMasonry' },
    alerts: { placement: 'overlay' },
    gutterPx: LAYOUT_GUTTER_PX,
    outerInsetPx: LAYOUT_OUTER_INSET_PX,
  }
}

export function createMobileLayout(rng: Rng): MobileLayout {
  const available = [...SERVICE_WINDOWS]
  const selected: ServiceWindow[] = []

  while (selected.length < 2) {
    const index = Math.floor(rng.next() * available.length)
    const [window] = available.splice(index, 1)
    if (window === undefined) {
      throw new RangeError('RNG value must be in [0, 1)')
    }
    selected.push(window)
  }

  selected.sort(
    (left, right) => SERVICE_PRIORITY[left] - SERVICE_PRIORITY[right],
  )

  return {
    kind: 'Mobile',
    windows: ['Minigame', selected[0]!, selected[1]!],
    dopamineBar: { placement: 'outsideMasonry' },
    alerts: { placement: 'overlay' },
    gutterPx: LAYOUT_GUTTER_PX,
    outerInsetPx: LAYOUT_OUTER_INSET_PX,
  }
}
