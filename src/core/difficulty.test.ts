import {
  ATTENTION_REQUEST_DURATION_EARLY_MS,
  ATTENTION_REQUEST_DURATION_LATE_MS,
  DIFFICULTY_TIME_TO_MAX_MS,
  DOPAMINE_DRAIN_DIFFICULTY_MULT_MAX,
  DOPAMINE_DRAIN_DIFFICULTY_MULT_MIN,
  EVENT_INTERVAL_EARLY_MS,
  EVENT_INTERVAL_LATE_MS,
} from '../config/balance'
import {
  difficultyAt,
  pressureMultipliersAt,
  type Difficulty,
} from './difficulty'

describe('continuous Match difficulty', () => {
  it('starts at minimum and rises smoothly toward maximum', () => {
    expect(difficultyAt(0)).toEqual<Difficulty>({
      elapsedMs: 0,
      progress: 0,
      dopamineDrainMultiplier: DOPAMINE_DRAIN_DIFFICULTY_MULT_MIN,
    })

    const early = difficultyAt(60_000)
    const nextMoment = difficultyAt(60_001)
    const maximum = difficultyAt(DIFFICULTY_TIME_TO_MAX_MS)

    expect(early.progress).toBeGreaterThan(0)
    expect(nextMoment.progress).toBeGreaterThan(early.progress)
    expect(
      nextMoment.dopamineDrainMultiplier - early.dopamineDrainMultiplier,
    ).toBeLessThan(0.001)
    expect(maximum.dopamineDrainMultiplier).toBe(
      DOPAMINE_DRAIN_DIFFICULTY_MULT_MAX,
    )
  })

  it('provides Dopamine drain strictly as a multiplier', () => {
    const difficulty = difficultyAt(300_000)

    expect(difficulty.dopamineDrainMultiplier).toBeGreaterThan(
      DOPAMINE_DRAIN_DIFFICULTY_MULT_MIN,
    )
    expect(difficulty.dopamineDrainMultiplier).toBeLessThan(
      DOPAMINE_DRAIN_DIFFICULTY_MULT_MAX,
    )
    expect(difficulty).not.toHaveProperty('dopaminePenalty')
    expect(difficulty).not.toHaveProperty('scoreFormula')
    expect(difficulty).not.toHaveProperty('controls')
  })

  it('exposes continuous event-pressure multipliers for all systems', () => {
    expect(pressureMultipliersAt(0)).toEqual({
      eventIntervalMultiplier: 1,
      attentionRequestDurationMultiplier: 1,
    })
    expect(pressureMultipliersAt(DIFFICULTY_TIME_TO_MAX_MS)).toEqual({
      eventIntervalMultiplier: EVENT_INTERVAL_LATE_MS / EVENT_INTERVAL_EARLY_MS,
      attentionRequestDurationMultiplier:
        ATTENTION_REQUEST_DURATION_LATE_MS /
        ATTENTION_REQUEST_DURATION_EARLY_MS,
    })

    const middle = pressureMultipliersAt(DIFFICULTY_TIME_TO_MAX_MS / 2)
    expect(middle.eventIntervalMultiplier).toBeLessThan(1)
    expect(middle.eventIntervalMultiplier).toBeGreaterThan(
      EVENT_INTERVAL_LATE_MS / EVENT_INTERVAL_EARLY_MS,
    )
  })
})
