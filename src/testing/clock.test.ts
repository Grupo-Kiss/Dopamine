import { createFakeClock } from './clock'

describe('injected clock fake', () => {
  it('moves now only when advance is called', () => {
    const clock = createFakeClock(1_000)

    expect(clock.now()).toBe(1_000)
    clock.advance(250)
    expect(clock.now()).toBe(1_250)
  })

  it('rejects time travel', () => {
    const clock = createFakeClock()

    expect(() => clock.advance(-1)).toThrow('non-negative')
  })
})
