export type AudioBus = 'master' | 'sfx' | 'loop' | 'pulse' | 'wave' | 'echo'

export type AudioCall =
  | { operation: 'unlock' }
  | { operation: 'suspend' }
  | { operation: 'setBusGain'; bus: AudioBus; gain: number }
  | { operation: 'setBusMuffled'; bus: AudioBus; muffled: boolean }

export interface AudioPort {
  unlock(): Promise<void>
  suspend(): Promise<void>
  setBusGain(bus: AudioBus, gain: number): void
  setBusMuffled(bus: AudioBus, muffled: boolean): void
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
    setBusMuffled(bus, muffled) {
      calls.push({ operation: 'setBusMuffled', bus, muffled })
    },
  }
}
