export interface Clock {
  now(): number
}

export interface FakeClock extends Clock {
  advance(milliseconds: number): void
}

export function createFakeClock(initialTime = 0): FakeClock {
  let currentTime = initialTime

  return {
    now: () => currentTime,
    advance(milliseconds) {
      if (!Number.isFinite(milliseconds) || milliseconds < 0) {
        throw new RangeError(
          'Clock advance must be a finite, non-negative value',
        )
      }

      currentTime += milliseconds
    },
  }
}
