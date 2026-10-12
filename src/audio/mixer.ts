import type { AudioBus, AudioPort } from '../testing/audio'

export type AudioMixer = {
  unlock(): Promise<void>
  setBusGain(bus: AudioBus, gain: number): void
  setBusMuffled(bus: AudioBus, muffled: boolean): void
  silence(): Promise<void>
}

export function createAudioMixer(port: AudioPort): AudioMixer {
  return {
    unlock: () => port.unlock(),
    setBusGain: (bus, gain) => port.setBusGain(bus, gain),
    setBusMuffled: (bus, muffled) => port.setBusMuffled(bus, muffled),
    silence: () => port.suspend(),
  }
}
