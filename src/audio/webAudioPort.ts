import { MUFFLE_OPEN_LOWPASS_HZ, MUFFLE_RAMP_MS } from '../config/balance'
import type { AudioBus, AudioPort } from '../testing/audio'
import { AUDIO_BUSES, type BusMuffle } from './muffling'

export interface AudioParamLike {
  value: number
  setTargetAtTime(
    target: number,
    startTime: number,
    timeConstant: number,
  ): unknown
}

export interface AudioNodeLike {
  connect(destination: AudioNodeLike): unknown
}

export interface GainNodeLike extends AudioNodeLike {
  readonly gain: AudioParamLike
}

export interface BiquadFilterNodeLike extends AudioNodeLike {
  type: string
  readonly frequency: AudioParamLike
}

/** Structural subset of `AudioContext`, so tests can inject a recordable fake. */
export interface AudioContextLike {
  readonly currentTime: number
  readonly destination: AudioNodeLike
  createGain(): GainNodeLike
  createBiquadFilter?(): BiquadFilterNodeLike
  resume(): Promise<void>
  suspend(): Promise<void>
}

export type MediaBus = Exclude<AudioBus, 'master'>

export interface WebAudioPort extends AudioPort {
  /** Where media elements / SFX sources connect for a bus. */
  input(bus: MediaBus): AudioNodeLike
  /** False when the browser lacks BiquadFilterNode (gain-only ducks). */
  readonly filtered: boolean
}

type BusStage = {
  readonly volume: GainNodeLike
  readonly filter: BiquadFilterNodeLike | null
  readonly muffle: GainNodeLike
}

type Graph = {
  readonly context: AudioContextLike
  readonly buses: Readonly<Record<AudioBus, BusStage>>
}

// setTargetAtTime reaches ~95% of the target after three time constants.
const RAMP_TIME_CONSTANT_S = MUFFLE_RAMP_MS / 1_000 / 3

export function createWebAudioPort(
  createContext: () => AudioContextLike,
): WebAudioPort {
  let graph: Graph | null = null
  const ensureGraph = (): Graph => (graph ??= buildGraph(createContext()))

  const ramp = (param: AudioParamLike, target: number) => {
    param.setTargetAtTime(
      target,
      ensureGraph().context.currentTime,
      RAMP_TIME_CONSTANT_S,
    )
  }

  return {
    get filtered() {
      return ensureGraph().buses.master.filter !== null
    },
    input: (bus) => ensureGraph().buses[bus].volume,
    unlock: () => ensureGraph().context.resume(),
    suspend: () => ensureGraph().context.suspend(),
    setBusGain(bus, gain) {
      assertGain(gain)
      ramp(ensureGraph().buses[bus].volume.gain, gain)
    },
    setBusMuffle(bus, muffle: BusMuffle) {
      assertGain(muffle.gain)
      const stage = ensureGraph().buses[bus]
      if (stage.filter) ramp(stage.filter.frequency, muffle.lowpassHz)
      ramp(stage.muffle.gain, muffle.gain)
    },
    playCue(_request) {
      // Buffer decode / one-shot scheduling lands with media element wiring.
      // Cue ids are dispatched through the mixer; the graph input is ready.
      void _request
      void ensureGraph()
    },
  }
}

function buildGraph(context: AudioContextLike): Graph {
  const createStage = (): BusStage => {
    const volume = context.createGain()
    const muffle = context.createGain()
    const filter = context.createBiquadFilter?.() ?? null

    if (filter) {
      filter.type = 'lowpass'
      filter.frequency.value = MUFFLE_OPEN_LOWPASS_HZ
      volume.connect(filter)
      filter.connect(muffle)
    } else {
      volume.connect(muffle)
    }
    return { volume, filter, muffle }
  }

  const buses = Object.fromEntries(
    AUDIO_BUSES.map((bus) => [bus, createStage()]),
  ) as Record<AudioBus, BusStage>

  for (const bus of AUDIO_BUSES) {
    buses[bus].muffle.connect(
      bus === 'master' ? context.destination : buses.master.volume,
    )
  }

  return { context, buses }
}

function assertGain(gain: number): void {
  if (!Number.isFinite(gain) || gain < 0) {
    throw new RangeError('Audio bus gain must be finite and non-negative')
  }
}
