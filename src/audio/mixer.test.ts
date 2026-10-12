import { createFakeAudioPort } from '../testing/audio'
import { createAudioMixer } from './mixer'

describe('audio mixer', () => {
  it('unlocks on demand and forwards bus duck/muffle messages', async () => {
    const port = createFakeAudioPort()
    const mixer = createAudioMixer(port)

    await mixer.unlock()
    mixer.setBusGain('wave', 0.4)
    mixer.setBusMuffled('echo', true)

    expect(port.calls).toEqual([
      { operation: 'unlock' },
      { operation: 'setBusGain', bus: 'wave', gain: 0.4 },
      { operation: 'setBusMuffled', bus: 'echo', muffled: true },
    ])
  })

  it('hard-silences Game Over by suspending the graph', async () => {
    const port = createFakeAudioPort()
    const mixer = createAudioMixer(port)

    await mixer.silence()

    expect(port.calls).toEqual([{ operation: 'suspend' }])
  })
})
