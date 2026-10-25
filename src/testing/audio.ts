import type { BusMuffle } from '../audio/muffling'
import type {
  AudioContextLike,
  AudioNodeLike,
  AudioParamLike,
} from '../audio/webAudioPort'

export type AudioBus = 'master' | 'sfx' | 'loop' | 'pulse' | 'wave' | 'echo'

export type AudioCall =
  | { operation: 'unlock' }
  | { operation: 'suspend' }
  | { operation: 'setBusGain'; bus: AudioBus; gain: number }
  | {
      operation: 'setBusMuffle'
      bus: AudioBus
      gain: number
      lowpassHz: number
    }
  | { operation: 'playCue'; id: string; bus: AudioBus }

export interface AudioPort {
  unlock(): Promise<void>
  suspend(): Promise<void>
  setBusGain(bus: AudioBus, gain: number): void
  setBusMuffle(bus: AudioBus, muffle: BusMuffle): void
  playCue(request: { readonly id: string; readonly bus: AudioBus }): void
}

export interface FakeAudioPort extends AudioPort {
  readonly calls: AudioCall[]
}

export function createFakeAudioPort(): FakeAudioPort {
  const calls: AudioCall[] = []

  return {
    calls,
    async unlock() {
      calls.push({ operation: 'unlock' })
    },
    async suspend() {
      calls.push({ operation: 'suspend' })
    },
    setBusGain(bus, gain) {
      if (!Number.isFinite(gain) || gain < 0) {
        throw new RangeError('Audio bus gain must be finite and non-negative')
      }

      calls.push({ operation: 'setBusGain', bus, gain })
    },
    setBusMuffle(bus, muffle) {
      calls.push({ operation: 'setBusMuffle', bus, ...muffle })
    },
    playCue({ id, bus }) {
      calls.push({ operation: 'playCue', id, bus })
    },
  }
}

export type FakeAudioParam = AudioParamLike & {
  readonly automation: {
    target: number
    startTime: number
    timeConstant: number
  }[]
}

type FakeNodeBase = {
  readonly connections: FakeAudioNode[]
  connect(destination: AudioNodeLike): FakeAudioNode
}

export type FakeDestinationNode = FakeNodeBase & {
  readonly kind: 'destination'
}
export type FakeGainNode = FakeNodeBase & {
  readonly kind: 'gain'
  readonly gain: FakeAudioParam
}
export type FakeBiquadFilterNode = FakeNodeBase & {
  readonly kind: 'biquad'
  type: string
  readonly frequency: FakeAudioParam
}
export type FakeAudioNode =
  FakeDestinationNode | FakeGainNode | FakeBiquadFilterNode

export interface FakeAudioContext extends AudioContextLike {
  currentTime: number
  readonly state: 'suspended' | 'running'
  readonly destination: FakeDestinationNode
  readonly nodes: FakeAudioNode[]
  readonly calls: ('resume' | 'suspend')[]
  createGain(): FakeGainNode
  createBiquadFilter?(): FakeBiquadFilterNode
}

export function createFakeAudioContext({
  biquadFilters = true,
}: { readonly biquadFilters?: boolean } = {}): FakeAudioContext {
  const nodes: FakeAudioNode[] = []
  const calls: FakeAudioContext['calls'] = []
  let state: FakeAudioContext['state'] = 'suspended'

  const connectable = (): FakeNodeBase => {
    const connections: FakeAudioNode[] = []
    return {
      connections,
      connect(destination) {
        const node = destination as FakeAudioNode
        connections.push(node)
        return node
      },
    }
  }

  const param = (value: number): FakeAudioParam => {
    const automation: FakeAudioParam['automation'] = []
    return {
      value,
      automation,
      setTargetAtTime(target, startTime, timeConstant) {
        automation.push({ target, startTime, timeConstant })
        return this
      },
    }
  }

  const context: FakeAudioContext = {
    currentTime: 0,
    get state() {
      return state
    },
    destination: { kind: 'destination', ...connectable() },
    nodes,
    calls,
    createGain() {
      const node: FakeGainNode = {
        kind: 'gain',
        gain: param(1),
        ...connectable(),
      }
      nodes.push(node)
      return node
    },
    async resume() {
      calls.push('resume')
      state = 'running'
    },
    async suspend() {
      calls.push('suspend')
      state = 'suspended'
    },
  }

  if (biquadFilters) {
    context.createBiquadFilter = () => {
      const node: FakeBiquadFilterNode = {
        kind: 'biquad',
        type: 'lowpass',
        frequency: param(350),
        ...connectable(),
      }
      nodes.push(node)
      return node
    }
  }

  return context
}
