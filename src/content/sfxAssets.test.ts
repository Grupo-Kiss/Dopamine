import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO_ROOT = process.cwd()
const MANIFEST_PATH = resolve(REPO_ROOT, 'content/sfx/manifest.json')

/** Optional cues from defs/15 — may stay missing until polish. */
const OPTIONAL_CUE_IDS = new Set(['sfx_ui_soft_tick', 'sfx_alert_dismiss'])

type SfxCue = {
  readonly id: string
  readonly path: string
  readonly bus: string
  readonly status: string
  readonly license: string | null
  readonly attribution: string | null
}

type SfxManifest = {
  readonly version: number
  readonly cues: readonly SfxCue[]
}

describe('sfx: content/sfx/manifest.json every required cue resolves to an existing file in tests/CI asset check', () => {
  const manifest = JSON.parse(
    readFileSync(MANIFEST_PATH, 'utf8'),
  ) as SfxManifest

  const required = manifest.cues.filter((cue) => !OPTIONAL_CUE_IDS.has(cue.id))

  it('lists every required cue as final with an on-disk .ogg', () => {
    expect(required.length).toBeGreaterThan(0)

    const missing: string[] = []
    for (const cue of required) {
      const absolute = resolve(REPO_ROOT, cue.path)
      if (!existsSync(absolute)) {
        missing.push(`${cue.id} → ${cue.path} (file missing)`)
        continue
      }
      if (cue.status !== 'final') {
        missing.push(`${cue.id} status is ${cue.status}, expected final`)
      }
      if (!cue.path.endsWith('.ogg')) {
        missing.push(`${cue.id} path must be .ogg`)
      }
    }

    expect(missing).toEqual([])
  })

  it('credits third-party SFX cues in the credits store', () => {
    const store = JSON.parse(
      readFileSync(resolve(REPO_ROOT, 'content/credits/store.json'), 'utf8'),
    ) as { readonly records: readonly { readonly id: string }[] }
    const creditIds = new Set(store.records.map((record) => record.id))

    const thirdParty = required.filter(
      (cue) =>
        cue.license !== null &&
        cue.license !== 'owned' &&
        cue.license.trim().length > 0,
    )

    for (const cue of thirdParty) {
      expect(creditIds.has(cue.id)).toBe(true)
    }
  })
})
