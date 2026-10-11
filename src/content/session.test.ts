import { createSequenceRng } from '../testing/rng'
import { createSessionValues } from './session'

describe('Loading session values', () => {
  it('deterministically picks a Minigame and allowed desktop shuffle', () => {
    const first = createSessionValues(createSequenceRng([0.6, 0.9, 0.1]))
    const replay = createSessionValues(createSequenceRng([0.6, 0.9, 0.1]))

    expect(first).toEqual(replay)
    expect(first).toEqual({
      minigameId: 'block_cascade',
      desktopLayout: {
        minigameSide: 'right',
        bottomOrder: ['Pulse', 'Echo'],
      },
    })
  })
})
