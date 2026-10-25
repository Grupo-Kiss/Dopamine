export type SfxBusId =
  | 'bus_critical'
  | 'bus_reward'
  | 'bus_combo'
  | 'bus_minigame'
  | 'bus_alert'
  | 'bus_ui'

export type SfxCue = {
  readonly id: string
  readonly path: string
  readonly bus: SfxBusId
  readonly status: string
  readonly license: string | null
  readonly attribution: string | null
}

export type SfxCueManifest = {
  readonly version: number
  readonly cues: readonly SfxCue[]
}

/** Domain events → manifest cue ids. Core never hard-codes filenames. */
export const DOMAIN_CUE_IDS = {
  focusChainStep: 'sfx_chain_step',
  alertOpen: 'sfx_alert_normal',
  minigameHit: 'sfx_ld_hit',
} as const

export type DomainCueId = (typeof DOMAIN_CUE_IDS)[keyof typeof DOMAIN_CUE_IDS]

export function resolveCue(manifest: SfxCueManifest, id: string): SfxCue {
  const cue = manifest.cues.find((entry) => entry.id === id)
  if (!cue) {
    throw new RangeError(`Unknown cue id: ${id}`)
  }
  return cue
}
