import type { AudioBus, AudioPort } from '../testing/audio'
import {
  AUDIO_BUSES,
  busMuffling,
  OPEN_MUFFLE,
  PLAYING_MUFFLE,
  type BusMuffle,
  type FeelAudioState,
} from './muffling'

export type AudioMixer = {
  unlock(): Promise<void>
  setBusGain(bus: AudioBus, gain: number): void
  setBusMuffled(bus: AudioBus, muffled: boolean): void
  applyFeelState(state: FeelAudioState): void
  silence(): Promise<void>
}

export function createAudioMixer(port: AudioPort): AudioMixer {
  const applied = new Map<AudioBus, BusMuffle>()

  const setBusMuffle = (bus: AudioBus, muffle: BusMuffle) => {
    const previous = applied.get(bus)
    if (
      previous?.gain === muffle.gain &&
      previous.lowpassHz === muffle.lowpassHz
    ) {
      return
    }
    applied.set(bus, muffle)
    port.setBusMuffle(bus, muffle)
  }

  return {
    unlock: () => port.unlock(),
    setBusGain: (bus, gain) => port.setBusGain(bus, gain),
    setBusMuffled: (bus, muffled) =>
      setBusMuffle(bus, muffled ? PLAYING_MUFFLE : OPEN_MUFFLE),
    applyFeelState(state) {
      const muffling = busMuffling(state)
      for (const bus of AUDIO_BUSES) setBusMuffle(bus, muffling[bus])
    },
    silence: () => port.suspend(),
  }
}
