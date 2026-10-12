import {
  MUFFLE_OPEN_LOWPASS_HZ,
  MUFFLE_PLAYING_GAIN,
  MUFFLE_PLAYING_LOWPASS_HZ,
  MUFFLE_RECOVERY_FOCUSED_GAIN,
  MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ,
  MUFFLE_RECOVERY_GAIN,
  MUFFLE_RECOVERY_LOWPASS_HZ,
  RECOVERY_DURATION_MS,
} from '../config/balance'
import type { BurnoutMode } from '../core/burnout'
import type { ActiveWindow } from '../core/focusChain'
import type { AudioBus } from '../testing/audio'

export type BusMuffle = {
  readonly gain: number
  readonly lowpassHz: number
}

export type FeelAudioState = {
  readonly mode: BurnoutMode
  readonly activeWindow: ActiveWindow | null
  /** 0 at Recovery start → 1 when Recovery ends. Ignored outside Recovery. */
  readonly recoveryProgress?: number
}

export type BusMuffling = Readonly<Record<AudioBus, BusMuffle>>

export const AUDIO_BUSES = [
  'master',
  'sfx',
  'loop',
  'pulse',
  'wave',
  'echo',
] as const satisfies readonly AudioBus[]

const WINDOW_BUS_BY_ACTIVE_WINDOW: Readonly<Record<string, AudioBus>> = {
  Loop: 'loop',
  Pulse: 'pulse',
  Wave: 'wave',
  Echo: 'echo',
}

export const OPEN_MUFFLE: BusMuffle = {
  gain: 1,
  lowpassHz: MUFFLE_OPEN_LOWPASS_HZ,
}

export const PLAYING_MUFFLE: BusMuffle = {
  gain: MUFFLE_PLAYING_GAIN,
  lowpassHz: MUFFLE_PLAYING_LOWPASS_HZ,
}

const RECOVERY_MUFFLE: BusMuffle = {
  gain: MUFFLE_RECOVERY_GAIN,
  lowpassHz: MUFFLE_RECOVERY_LOWPASS_HZ,
}

const RECOVERY_FOCUSED_MUFFLE: BusMuffle = {
  gain: MUFFLE_RECOVERY_FOCUSED_GAIN,
  lowpassHz: MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ,
}

type BusRole = 'master' | 'sfx' | 'focused' | 'unfocused'

export function busMuffling(state: FeelAudioState): BusMuffling {
  const focusedBus =
    state.activeWindow === null
      ? null
      : (WINDOW_BUS_BY_ACTIVE_WINDOW[state.activeWindow] ?? null)
  const progress = state.recoveryProgress ?? 0
  if (!(progress >= 0 && progress <= 1)) {
    throw new RangeError('Recovery progress must be between 0 and 1')
  }

  const roleOf = (bus: AudioBus): BusRole =>
    bus === 'master' || bus === 'sfx'
      ? bus
      : bus === focusedBus
        ? 'focused'
        : 'unfocused'

  return Object.fromEntries(
    AUDIO_BUSES.map((bus) => [
      bus,
      muffleFor(state.mode, roleOf(bus), progress),
    ]),
  ) as Record<AudioBus, BusMuffle>
}

export function recoveryProgress(
  recoveryEndsAtMs: number | null,
  nowMs: number,
): number {
  if (recoveryEndsAtMs === null) return 1
  const remainingMs = recoveryEndsAtMs - nowMs
  return Math.min(1, Math.max(0, 1 - remainingMs / RECOVERY_DURATION_MS))
}

function muffleFor(
  mode: BurnoutMode,
  role: BusRole,
  recoveryProgressValue: number,
): BusMuffle {
  if (role === 'master' || mode === 'Burnout') return OPEN_MUFFLE

  const playing = role === 'unfocused' ? PLAYING_MUFFLE : OPEN_MUFFLE
  if (mode === 'Playing') return playing

  const recoveryStart =
    role === 'unfocused' ? RECOVERY_MUFFLE : RECOVERY_FOCUSED_MUFFLE
  return easeMuffle(recoveryStart, playing, recoveryProgressValue)
}

function easeMuffle(
  from: BusMuffle,
  to: BusMuffle,
  progress: number,
): BusMuffle {
  if (progress === 0) return from
  if (progress === 1) return to

  return {
    gain: from.gain + (to.gain - from.gain) * progress,
    lowpassHz: Math.exp(
      Math.log(from.lowpassHz) +
        (Math.log(to.lowpassHz) - Math.log(from.lowpassHz)) * progress,
    ),
  }
}
