import {
  ANTICIPATION_CAP_VS_DIRECT_MULT,
  DOPAMINE_DRAIN_PER_SECOND_BASE,
  DOPAMINE_DRAIN_RECOVERY_MULT,
  DOPAMINE_MAX,
  DOPAMINE_MIN,
  DIMINISH_FLOOR_MULT,
} from '../config/balance'
import { createFakeClock } from '../testing/clock'
import * as dopamine from './dopamine'

describe('Dopamine', () => {
  it('starts full and clamps gains and passive drain to its bounds', () => {
    const clock = createFakeClock()
    const full = dopamine.createDopamineMeter(clock)
    const overfilled = dopamine.grantDopamine(full, 50)

    expect(full.value).toBe(DOPAMINE_MAX)
    expect(overfilled.value).toBe(DOPAMINE_MAX)

    clock.advance(1_000_000)
    expect(
      dopamine.tickDopamine(overfilled, clock, {
        difficultyMultiplier: 3,
        recovery: true,
      }).value,
    ).toBe(DOPAMINE_MIN)
  })

  it('drains only elapsed Playing time using difficulty and Recovery', () => {
    const clock = createFakeClock(10_000)
    const meter = dopamine.createDopamineMeter(clock)

    clock.advance(2_000)
    const normal = dopamine.tickDopamine(meter, clock, {
      difficultyMultiplier: 2,
      recovery: false,
    })

    expect(normal.value).toBe(
      DOPAMINE_MAX - DOPAMINE_DRAIN_PER_SECOND_BASE * 2 * 2,
    )

    clock.advance(2_000)
    const recovery = dopamine.tickDopamine(normal, clock, {
      difficultyMultiplier: 2,
      recovery: true,
    })

    expect(recovery.value).toBe(
      normal.value -
        DOPAMINE_DRAIN_PER_SECOND_BASE *
          2 *
          DOPAMINE_DRAIN_RECOVERY_MULT *
          2,
    )
  })

  it('accepts non-negative interaction gains and rejects subtraction', () => {
    const clock = createFakeClock()
    const meter = dopamine.createDopamineMeter(clock)
    clock.advance(10_000)
    const drained = dopamine.tickDopamine(meter, clock, {
      difficultyMultiplier: 1,
      recovery: false,
    })

    expect(dopamine.grantDopamine(drained, 2).value).toBe(drained.value + 2)
    expect(dopamine.grantDopamine(drained, 0)).toEqual(drained)
    expect(() => dopamine.grantDopamine(drained, -1)).toThrow(
      'cannot be negative',
    )
  })

  it('applies logarithmic same-target falloff with a positive floor', () => {
    let efficiency = dopamine.createDiminishingState()
    const grants: number[] = []

    for (let interaction = 0; interaction < 10_000; interaction += 1) {
      const result = dopamine.calculateInteractionGain(efficiency, {
        systemId: 'Pulse',
        targetId: 'post-1',
        baseGain: 10,
      })
      efficiency = result.state
      grants.push(result.gain)
    }

    expect(grants[0]).toBe(10)
    expect(grants[1]).toBeLessThan(grants[0]!)
    expect(grants[2]).toBeLessThan(grants[1]!)
    expect(grants.at(-1)).toBe(10 * DIMINISH_FLOOR_MULT)
    expect(grants.every((gain) => gain > 0)).toBe(true)
  })

  it('resets diminishing returns when target or gameplay system changes', () => {
    const first = dopamine.calculateInteractionGain(
      dopamine.createDiminishingState(),
      { systemId: 'Pulse', targetId: 'post-1', baseGain: 10 },
    )
    const repeated = dopamine.calculateInteractionGain(first.state, {
      systemId: 'Pulse',
      targetId: 'post-1',
      baseGain: 10,
    })
    const newTarget = dopamine.calculateInteractionGain(repeated.state, {
      systemId: 'Pulse',
      targetId: 'post-2',
      baseGain: 10,
    })
    const newSystem = dopamine.calculateInteractionGain(repeated.state, {
      systemId: 'Loop',
      targetId: 'clip-1',
      baseGain: 10,
    })

    expect(repeated.gain).toBeLessThan(10)
    expect(newTarget.gain).toBe(10)
    expect(newSystem.gain).toBe(10)
  })

  it('builds Anticipation while waiting and caps it below direct rewards', () => {
    let anticipation = dopamine.createAnticipationBonus()

    for (let step = 0; step < 100; step += 1) {
      anticipation = dopamine.buildAnticipationBonus(anticipation, 4)
    }

    expect(anticipation.kind).toBe('AnticipationBonus')
    expect(anticipation.value).toBeGreaterThan(0)
    expect(anticipation.value).toBeLessThanOrEqual(
      4 * ANTICIPATION_CAP_VS_DIRECT_MULT,
    )
  })

  it.each(['obtained', 'left', 'expired'] as const)(
    'resets Anticipation when the opportunity is %s',
    (reason) => {
      const built = dopamine.buildAnticipationBonus(
        dopamine.createAnticipationBonus(),
        4,
      )

      expect(dopamine.resetAnticipationBonus(built, reason)).toEqual(
        dopamine.createAnticipationBonus(),
      )
    },
  )

  it('does not expose a direct Dopamine penalty API', () => {
    expect(Object.keys(dopamine)).not.toEqual(
      expect.arrayContaining([
        'penalizeDopamine',
        'damage',
        'loseLife',
        'subtractDopamine',
      ]),
    )
  })
})
