import type { PulsePost } from '../windows/pulse'
import type { EchoItem } from '../windows/echo'
import type { WaveTrack } from '../windows/wave'
import type { LoopClip } from '../windows/loop'

const DEFAULT_WAVE_DURATION_MS = 90_000
const DEFAULT_ECHO_TAIL_SEC = 15

export type LoopManifestClip = {
  readonly id: string
  readonly path: string
  readonly title?: string
}

export type WaveManifestTrack = {
  readonly id: string
  readonly path?: string
  readonly title?: string
  readonly durationMs?: number
}

export type EchoManifestItem = {
  readonly id: string
  readonly title?: string
  readonly moments?: readonly { readonly atSec: number }[]
}

export type MatchStarterPack = {
  readonly loopClips: readonly LoopClip[]
  readonly waveTracks: readonly WaveTrack[]
  readonly echoItems: readonly EchoItem[]
  readonly pulsePosts: readonly PulsePost[]
}

export type MatchContentLabels = {
  readonly loopTitle: string
  readonly waveTitle: string
  readonly echoTitle: string
}

export function labelsFromManifests(input: {
  readonly loopManifest: readonly LoopManifestClip[]
  readonly waveManifest: readonly WaveManifestTrack[]
  readonly echoManifest: readonly EchoManifestItem[]
}): MatchContentLabels {
  return {
    loopTitle: input.loopManifest[0]?.title ?? input.loopManifest[0]?.id ?? 'Loop',
    waveTitle: input.waveManifest[0]?.title ?? input.waveManifest[0]?.id ?? 'Wave',
    echoTitle: input.echoManifest[0]?.title ?? input.echoManifest[0]?.id ?? 'Echo',
  }
}

export function loopClipsFromManifest(
  clips: readonly LoopManifestClip[],
): LoopClip[] {
  return clips.map((clip) => ({
    id: clip.id,
    source: clip.path,
  }))
}

export function waveTracksFromManifest(
  tracks: readonly WaveManifestTrack[],
): WaveTrack[] {
  return tracks.map((track) => ({
    id: track.id,
    durationMs: track.durationMs ?? DEFAULT_WAVE_DURATION_MS,
  }))
}

export function echoItemsFromManifest(
  items: readonly EchoManifestItem[],
): EchoItem[] {
  return items.map((item) => {
    const moments = item.moments ?? [{ atSec: 30 }]
    const first = moments[0]?.atSec ?? 30
    const last = moments.at(-1)?.atSec ?? first
    return {
      id: item.id,
      highlightAtMs: first * 1_000,
      durationMs: (last + DEFAULT_ECHO_TAIL_SEC) * 1_000,
    }
  })
}

export function buildMatchStarterPack(input: {
  readonly loopManifest: readonly LoopManifestClip[]
  readonly waveManifest: readonly WaveManifestTrack[]
  readonly echoManifest: readonly EchoManifestItem[]
  readonly pulsePosts: readonly PulsePost[]
}): MatchStarterPack {
  return {
    loopClips: loopClipsFromManifest(input.loopManifest),
    waveTracks: waveTracksFromManifest(input.waveManifest),
    echoItems: echoItemsFromManifest(input.echoManifest),
    pulsePosts: input.pulsePosts,
  }
}
