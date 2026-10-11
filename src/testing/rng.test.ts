import { createSeededRng, createSequenceRng } from './rng'

describe('injected RNG fakes', () => {
  it('returns a deterministic sequence for Match picks', () => {
    const rng = createSequenceRng([0.75, 0.1])

    expect([rng.next(), rng.next()]).toEqual([0.75, 0.1])
  })

  it('replays the same values for the same seed', () => {
    const first = createSeededRng(42)
    const second = createSeededRng(42)

    expect([first.next(), first.next(), first.next()]).toEqual([
      second.next(),
      second.next(),
      second.next(),
    ])
  })
})
