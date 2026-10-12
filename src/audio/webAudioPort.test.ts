import {
  MUFFLE_OPEN_LOWPASS_HZ,
  MUFFLE_PLAYING_GAIN,
  MUFFLE_PLAYING_LOWPASS_HZ,
  MUFFLE_RAMP_MS,
  MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ,
  MUFFLE_RECOVERY_LOWPASS_HZ,
} from '../config/balance'
import {
  createFakeAudioContext,
  type AudioBus,
  type FakeAudioContext,
  type FakeAudioNode,
  type FakeBiquadFilterNode,
  type FakeGainNode,
} from '../testing/audio'
import { createAudioMixer } from './mixer'
import { createWebAudioPort, type WebAudioPort } from './webAudioPort'

const WINDOW_BUSES = ['loop', 'pulse', 'wave', 'echo'] as const
const RAMP_TIME_CONSTANT_S = MUFFLE_RAMP_MS / 1_000 / 3

function chainFrom(node: FakeAudioNode): FakeAudioNode['kind'][] {
  const kinds: FakeAudioNode['kind'][] = [node.kind]
  let current = node
  while (current.connections.length > 0) {
    expect(current.connections).toHaveLength(1)
    current = current.connections[0]
    kinds.push(current.kind)
  }
  return kinds
}

function stages(port: WebAudioPort, bus: Exclude<AudioBus, 'master'>) {
  const volume = port.input(bus) as FakeGainNode
  const filter = volume.connections[0] as FakeBiquadFilterNode
  const muffle = filter.connections[0] as FakeGainNode
  return { volume, filter, muffle }
}

function lastTarget(param: { readonly automation: { target: number }[] }) {
  return param.automation.at(-1)?.target
}

function setup(options?: { biquadFilters?: boolean }) {
  const context = createFakeAudioContext(options)
  const createContext = vi.fn((): FakeAudioContext => context)
  const port = createWebAudioPort(createContext)
  return { context, createContext, port }
}

describe('Web Audio port', () => {
  it('creates the AudioContext lazily and resumes it on unlock', async () => {
    const { context, createContext, port } = setup()
    expect(createContext).not.toHaveBeenCalled()

    await port.unlock()

    expect(createContext).toHaveBeenCalledTimes(1)
    expect(context.calls).toEqual(['resume'])
  })

  it('routes every bus through a real lowpass filter and muffle gain into master', async () => {
    const { context, port } = setup()
    await port.unlock()

    for (const bus of ['sfx', ...WINDOW_BUSES] as const) {
      expect(chainFrom(port.input(bus) as FakeAudioNode)).toEqual([
        'gain',
        'biquad',
        'gain',
        'gain',
        'biquad',
        'gain',
        'destination',
      ])
    }

    const filters = context.nodes.filter((node) => node.kind === 'biquad')
    expect(filters).toHaveLength(6)
    for (const filter of filters) {
      expect(filter.type).toBe('lowpass')
      expect(filter.frequency.value).toBe(MUFFLE_OPEN_LOWPASS_HZ)
    }
  })

  it('ramps filter cutoff and muffle gain instead of jumping', async () => {
    const { context, port } = setup()
    await port.unlock()
    context.currentTime = 3

    port.setBusMuffle('wave', { gain: 0.5, lowpassHz: 900 })

    const { filter, muffle } = stages(port, 'wave')
    expect(filter.frequency.automation).toEqual([
      { target: 900, startTime: 3, timeConstant: RAMP_TIME_CONSTANT_S },
    ])
    expect(muffle.gain.automation).toEqual([
      { target: 0.5, startTime: 3, timeConstant: RAMP_TIME_CONSTANT_S },
    ])
  })

  it('keeps priority ducks on the bus volume stage, separate from muffling', async () => {
    const { port } = setup()
    await port.unlock()

    port.setBusGain('echo', 0.4)
    port.setBusMuffle('echo', { gain: 0.7, lowpassHz: 2_200 })

    const { volume, muffle } = stages(port, 'echo')
    expect(lastTarget(volume.gain)).toBe(0.4)
    expect(lastTarget(muffle.gain)).toBe(0.7)
    expect(() => port.setBusGain('echo', -1)).toThrow(RangeError)
  })

  it('falls back to gain-only ducks when BiquadFilterNode is unavailable', async () => {
    const { context, port } = setup({ biquadFilters: false })
    await port.unlock()

    expect(chainFrom(port.input('loop') as FakeAudioNode)).toEqual([
      'gain',
      'gain',
      'gain',
      'gain',
      'destination',
    ])
    port.setBusMuffle('loop', { gain: 0.45, lowpassHz: 700 })
    const volume = port.input('loop') as FakeGainNode
    expect(lastTarget((volume.connections[0] as FakeGainNode).gain)).toBe(0.45)
    expect(context.nodes.some((node) => node.kind === 'biquad')).toBe(false)
    expect(port.filtered).toBe(false)
  })

  it('hard-silences by suspending the context', async () => {
    const { context, port } = setup()
    await port.unlock()
    await port.suspend()
    expect(context.calls).toEqual(['resume', 'suspend'])
  })
})

describe('audio/feel: bus muffling states follow 09 rules per Playing/Burnout/Recovery', () => {
  async function mixerWithGraph() {
    const { context, port } = setup()
    const mixer = createAudioMixer(port)
    await mixer.unlock()
    const cutoff = (bus: Exclude<AudioBus, 'master'>) =>
      lastTarget(stages(port, bus).filter.frequency)
    const muffleGain = (bus: Exclude<AudioBus, 'master'>) =>
      lastTarget(stages(port, bus).muffle.gain)
    return { context, mixer, cutoff, muffleGain }
  }

  it('Playing filters non-focused window buses and leaves the focused one open', async () => {
    const { mixer, cutoff, muffleGain } = await mixerWithGraph()

    mixer.applyFeelState({ mode: 'Playing', activeWindow: 'Loop' })

    expect(cutoff('loop')).toBe(MUFFLE_OPEN_LOWPASS_HZ)
    expect(muffleGain('loop')).toBe(1)
    for (const bus of ['pulse', 'wave', 'echo'] as const) {
      expect(cutoff(bus)).toBe(MUFFLE_PLAYING_LOWPASS_HZ)
      expect(muffleGain(bus)).toBe(MUFFLE_PLAYING_GAIN)
    }
    expect(cutoff('sfx')).toBe(MUFFLE_OPEN_LOWPASS_HZ)
  })

  it('Burnout opens every filter', async () => {
    const { mixer, cutoff, muffleGain } = await mixerWithGraph()

    mixer.applyFeelState({ mode: 'Playing', activeWindow: 'Loop' })
    mixer.applyFeelState({ mode: 'Burnout', activeWindow: 'Loop' })

    for (const bus of ['sfx', ...WINDOW_BUSES] as const) {
      expect(cutoff(bus)).toBe(MUFFLE_OPEN_LOWPASS_HZ)
      expect(muffleGain(bus)).toBe(1)
    }
  })

  it('Recovery closes filters further, then eases back to the Playing mix', async () => {
    const { mixer, cutoff } = await mixerWithGraph()

    mixer.applyFeelState({
      mode: 'Recovery',
      activeWindow: 'Loop',
      recoveryProgress: 0,
    })
    expect(cutoff('pulse')).toBe(MUFFLE_RECOVERY_LOWPASS_HZ)
    expect(cutoff('loop')).toBe(MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ)
    expect(cutoff('sfx')).toBe(MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ)

    mixer.applyFeelState({
      mode: 'Recovery',
      activeWindow: 'Loop',
      recoveryProgress: 1,
    })
    expect(cutoff('pulse')).toBe(MUFFLE_PLAYING_LOWPASS_HZ)
    expect(cutoff('loop')).toBe(MUFFLE_OPEN_LOWPASS_HZ)
    expect(cutoff('sfx')).toBe(MUFFLE_OPEN_LOWPASS_HZ)
  })
})
