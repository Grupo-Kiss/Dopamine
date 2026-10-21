import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO_ROOT = process.cwd()

type ManifestItem = {
  readonly id: string
  readonly title: string
  readonly license: string
  readonly attribution: string
  readonly creatorLabel?: string
  readonly artistLabel?: string
}

type CreditRecord = {
  readonly id: string
  readonly kind: string
  readonly title: string
  readonly license: string
}

function readJson<T>(relative: string): T {
  return JSON.parse(readFileSync(resolve(REPO_ROOT, relative), 'utf8')) as T
}

/** Assets that require a credits row: anything not plain first-party `owned`. */
function needsCreditRow(item: ManifestItem): boolean {
  return item.license.trim() !== 'owned'
}

describe('credits: store.json includes a row for each manifest-attributed asset in expanded packs', () => {
  it('covers every third-party Loop / Wave / Echo / SFX manifest entry', () => {
    const store = readJson<{ readonly records: readonly CreditRecord[] }>(
      'content/credits/store.json',
    )
    const creditIds = new Set(store.records.map((record) => record.id))

    const loop = readJson<{ readonly clips: readonly ManifestItem[] }>(
      'content/loop/manifest.json',
    )
    const wave = readJson<{ readonly tracks: readonly ManifestItem[] }>(
      'content/wave/manifest.json',
    )
    const echo = readJson<{ readonly items: readonly ManifestItem[] }>(
      'content/echo/manifest.json',
    )
    const sfx = readJson<{ readonly cues: readonly ManifestItem[] }>(
      'content/sfx/manifest.json',
    )

    const attributed: { readonly creditId: string; readonly kind: string }[] =
      []

    for (const clip of loop.clips) {
      if (needsCreditRow(clip)) {
        attributed.push({ creditId: clip.id, kind: 'loop' })
      }
    }
    for (const track of wave.tracks) {
      if (needsCreditRow(track)) {
        attributed.push({ creditId: track.id, kind: 'wave' })
      }
    }
    for (const item of echo.items) {
      if (needsCreditRow(item)) {
        attributed.push({ creditId: item.id, kind: 'echo' })
      }
    }
    for (const cue of sfx.cues) {
      if (needsCreditRow(cue)) {
        attributed.push({ creditId: cue.id, kind: 'sfx' })
      }
    }

    expect(attributed.length).toBeGreaterThan(0)

    const missing = attributed.filter((entry) => !creditIds.has(entry.creditId))
    expect(missing).toEqual([])

    for (const entry of attributed) {
      const record = store.records.find((row) => row.id === entry.creditId)
      expect(record?.kind).toBe(entry.kind)
    }
  })
})
