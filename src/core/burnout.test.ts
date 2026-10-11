import {
  BURNOUT_APM_THRESHOLD_1,
  BURNOUT_APM_THRESHOLD_2,
  BURNOUT_APM_THRESHOLD_3,
  BURNOUT_APM_THRESHOLD_GROWTH,
  BURNOUT_ENTER_SUSTAIN_MS,
  BURNOUT_EXIT_BELOW_MS,
  BURNOUT_REWARD_MULT,
  BURNOUT_TELEGRAPH_APM_RATIO,
  DOPAMINE_DRAIN_RECOVERY_MULT,
  RECOVERY_DURATION_MS,
} from '../config/balance'
import { createFakeClock, type FakeClock } from '../testing/clock'
import {
  actionsPerMinute,
  createApmTracker,
  createBurnoutSystem,
  recordAction,
  thresholdAfterCompletedRecoveries,
  tickBurnout,
  type BurnoutSystem,
} from './burnout'

describe('Burnout and Recovery', () => {
  it('tracks APM over a sliding minute with an injected clock', () => {
    const clock = createFakeClock()
    let tracker = createApmTracker()

    for (let action = 0; action < 30; action += 1) {
      tracker = recordAction(tracker, clock)
    }
    expect(actionsPerMinute(tracker, clock)).toBe(30)

    clock.advance(60_001)
    expect(actionsPerMinute(tracker, clock)).toBe(0)
  })

  it('telegraphs near the threshold without entering Burnout', () => {
    const clock = createFakeClock()
    let system = createBurnoutSystem(clock)
    const telegraphActions = Math.ceil(
      BURNOUT_APM_THRESHOLD_1 * BURNOUT_TELEGRAPH_APM_RATIO,
    )

    system = recordActions(system, clock, telegraphActions)
    system = tickBurnout(system, clock)

    expect(system.mode).toBe('Playing')
    expect(system.telegraphActive).toBe(true)
    expect(system.apm).toBe(telegraphActions)
  })

  it('enters Burnout only after APM is sustained at the threshold', () => {
    const clock = createFakeClock()
    let system = recordActions(
      createBurnoutSystem(clock),
      clock,
      BURNOUT_APM_THRESHOLD_1,
    )

    system = tickBurnout(system, clock)
    clock.advance(BURNOUT_ENTER_SUSTAIN_MS - 1)
    system = tickBurnout(system, clock)
    expect(system.mode).toBe('Playing')

    clock.advance(1)
    system = tickBurnout(system, clock)
    expect(system.mode).toBe('Burnout')
    expect(system.rewardMultiplier).toBe(BURNOUT_REWARD_MULT)
  })

  it('exits low APM into fixed Recovery and blocks retriggering', () => {
    const clock = createFakeClock()
    let system = enterBurnout(clock)

    clock.advance(60_001)
    system = tickBurnout(system, clock)
    clock.advance(BURNOUT_EXIT_BELOW_MS)
    system = tickBurnout(system, clock)

    expect(system.mode).toBe('Recovery')
    expect(system.dopamineDrainMultiplier).toBe(
      DOPAMINE_DRAIN_RECOVERY_MULT,
    )

    system = recordActions(system, clock, 200)
    clock.advance(RECOVERY_DURATION_MS - 1)
    system = tickBurnout(system, clock)
    expect(system.mode).toBe('Recovery')

    clock.advance(1)
    system = tickBurnout(system, clock)
    expect(system.mode).toBe('Playing')
    expect(system.thresholdApm).toBe(BURNOUT_APM_THRESHOLD_2)
    expect(system.aboveThresholdSinceMs).toBeNull()
  })

  it('escalates the APM threshold after every completed Recovery', () => {
    expect(thresholdAfterCompletedRecoveries(0)).toBe(
      BURNOUT_APM_THRESHOLD_1,
    )
    expect(thresholdAfterCompletedRecoveries(1)).toBe(
      BURNOUT_APM_THRESHOLD_2,
    )
    expect(thresholdAfterCompletedRecoveries(2)).toBe(
      BURNOUT_APM_THRESHOLD_3,
    )
    expect(thresholdAfterCompletedRecoveries(3)).toBe(
      BURNOUT_APM_THRESHOLD_3 * BURNOUT_APM_THRESHOLD_GROWTH,
    )
    expect(thresholdAfterCompletedRecoveries(4)).toBe(
      BURNOUT_APM_THRESHOLD_3 * BURNOUT_APM_THRESHOLD_GROWTH ** 2,
    )
  })
})

function recordActions(
  initial: BurnoutSystem,
  clock: FakeClock,
  count: number,
): BurnoutSystem {
  let system = initial
  for (let action = 0; action < count; action += 1) {
    system = {
      ...system,
      apmTracker: recordAction(system.apmTracker, clock),
    }
  }
  return system
}

function enterBurnout(clock: FakeClock): BurnoutSystem {
  let system = recordActions(
    createBurnoutSystem(clock),
    clock,
    BURNOUT_APM_THRESHOLD_1,
  )
  system = tickBurnout(system, clock)
  clock.advance(BURNOUT_ENTER_SUSTAIN_MS)
  return tickBurnout(system, clock)
}
