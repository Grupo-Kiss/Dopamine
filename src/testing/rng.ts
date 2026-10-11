export interface Rng {
  next(): number
}

function assertUnitInterval(value: number): void {
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('RNG values must be in the interval [0, 1)')
  }
}

export function createSequenceRng(values: readonly number[]): Rng {
  values.forEach(assertUnitInterval)
  let index = 0

  return {
    next() {
      const value = values[index]
      if (value === undefined) {
        throw new Error('Fake RNG sequence exhausted')
      }

      index += 1
      return value
    },
  }
}

export function createSeededRng(seed: number): Rng {
  if (!Number.isSafeInteger(seed)) {
    throw new TypeError('RNG seed must be a safe integer')
  }

  let state = seed >>> 0

  return {
    next() {
      state += 0x6d2b79f5
      let value = state
      value = Math.imul(value ^ (value >>> 15), value | 1)
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
      return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
    },
  }
}
