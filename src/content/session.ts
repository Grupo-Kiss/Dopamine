import type { Rng } from '../testing/rng'

export type MinigameId = 'lane_defender' | 'block_cascade' | 'endless_runner'

export type SessionValues = {
  readonly minigameId: MinigameId
  readonly desktopLayout: {
    readonly minigameSide: 'left' | 'right'
    readonly bottomOrder:
      readonly ['Pulse', 'Echo'] | readonly ['Echo', 'Pulse']
  }
}

const MINIGAMES: readonly MinigameId[] = [
  'lane_defender',
  'block_cascade',
  'endless_runner',
]

export function createSessionValues(rng: Rng): SessionValues {
  const minigameId = pick(MINIGAMES, rng.next())
  const minigameSide = rng.next() < 0.5 ? 'left' : 'right'
  const bottomOrder =
    rng.next() < 0.5
      ? (['Pulse', 'Echo'] as const)
      : (['Echo', 'Pulse'] as const)

  return {
    minigameId,
    desktopLayout: {
      minigameSide,
      bottomOrder,
    },
  }
}

function pick<T>(values: readonly T[], randomValue: number): T {
  const value = values[Math.floor(randomValue * values.length)]
  if (value === undefined) {
    throw new RangeError('RNG value must be in [0, 1)')
  }
  return value
}
