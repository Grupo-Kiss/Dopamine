import { DOMAIN_CUE_IDS } from '../audio/cues'
import type { AudioMixer } from '../audio/mixer'

export type ShellCueEvent = keyof typeof DOMAIN_CUE_IDS

/** Domain Match events → mixer.playCue via stable DOMAIN_CUE_IDS (never filenames). */
export function playShellCue(audio: AudioMixer, event: ShellCueEvent): void {
  audio.playCue(DOMAIN_CUE_IDS[event])
}
