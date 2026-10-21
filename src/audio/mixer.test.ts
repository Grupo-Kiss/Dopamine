import {
  MUFFLE_OPEN_LOWPASS_HZ,
  MUFFLE_PLAYING_GAIN,
  MUFFLE_PLAYING_LOWPASS_HZ,
} from '../config/balance'
import { createFakeAudioPort } from '../testing/audio'
import { createAudioMixer } from './mixer'

describe('audio mixer', () => {
  it('unlocks on demand and forwards bus duck/muffle messages', async () => {
    const port = createFakeAudioPort()
    const mixer = createAudioMixer(port)

    await mixer.unlock()
    mixer.setBusGain('wave', 0.4)
    mixer.setBusMuffled('echo', true)
    mixer.setBusMuffled('echo', false)

    expect(port.calls).toEqual([
      { operation: 'unlock' },
      { operation: 'setBusGain', bus: 'wave', gain: 0.4 },
      {
        operation: 'setBusMuffle',
        bus: 'echo',
        gain: MUFFLE_PLAYING_GAIN,
        lowpassHz: MUFFLE_PLAYING_LOWPASS_HZ,
      },
      {
        operation: 'setBusMuffle',
        bus: 'echo',
        gain: 1,
        lowpassHz: MUFFLE_OPEN_LOWPASS_HZ,
      },
    ])
  })

  it('applies the feel-state muffling matrix to every bus', () => {
    const port = createFakeAudioPort()
    const mixer = createAudioMixer(port)

    mixer.applyFeelState({ mode: 'Playing', activeWindow: 'Pulse' })

    expect(port.calls).toEqual(
      ['master', 'sfx', 'loop', 'pulse', 'wave', 'echo'].map((bus) => ({
        operation: 'setBusMuffle',
        bus,
        ...(['loop', 'wave', 'echo'].includes(bus)
          ? { gain: MUFFLE_PLAYING_GAIN, lowpassHz: MUFFLE_PLAYING_LOWPASS_HZ }
          : { gain: 1, lowpassHz: MUFFLE_OPEN_LOWPASS_HZ }),
      })),
    )
  })

  it('only re-sends buses whose muffling changed', () => {
    const port = createFakeAudioPort()
    const mixer = createAudioMixer(port)

    mixer.applyFeelState({ mode: 'Playing', activeWindow: 'Pulse' })
    port.calls.length = 0
    mixer.applyFeelState({ mode: 'Playing', activeWindow: 'Pulse' })
    expect(port.calls).toEqual([])

    mixer.applyFeelState({ mode: 'Playing', activeWindow: 'Wave' })
    expect(port.calls.map((call) => 'bus' in call && call.bus)).toEqual([
      'pulse',
      'wave',
    ])
  })

  it('hard-silences Game Over by suspending the graph', async () => {
    const port = createFakeAudioPort()
    const mixer = createAudioMixer(port)

    await mixer.silence()

    expect(port.calls).toEqual([{ operation: 'suspend' }])
  })
})
