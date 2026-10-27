import { createFakeClock } from '../testing/clock'
import { createMatchSession, tickMatch } from './matchSession'
import { applyMatchReward } from './matchRewards'

describe('Match rewards from windows', () => {
  it('grants Dopamine and score from window interactions', () => {
    const clock = createFakeClock(0)
    let session = createMatchSession(clock)
    clock.advance(60_000)
    session = tickMatch(session, clock).session
    const drained = session.dopamine.value
    expect(drained).toBeLessThan(99)

    const next = applyMatchReward(session, { dopamine: 2, score: 40 })

    expect(next.dopamine.value).toBeCloseTo(Math.min(100, drained + 2), 2)
    expect(next.score).toBe(40)
  })

  it('ignores zero rewards', () => {
    const clock = createFakeClock(0)
    const session = createMatchSession(clock)

    expect(applyMatchReward(session, { dopamine: 0, score: 0 })).toBe(session)
  })
})
