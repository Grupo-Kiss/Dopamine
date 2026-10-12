import { createFakeAudioPort } from './audio'

describe('audio port fake', () => {
  it('records graph and bus messages without an AudioContext', async () => {
    const audio = createFakeAudioPort()

    await audio.unlock()
    audio.setBusGain('wave', 0.5)
    audio.setBusMuffled('wave', true)
    await audio.suspend()

    expect(audio.calls).toEqual([
      { operation: 'unlock' },
      { operation: 'setBusGain', bus: 'wave', gain: 0.5 },
      { operation: 'setBusMuffled', bus: 'wave', muffled: true },
      { operation: 'suspend' },
    ])
  })
})
