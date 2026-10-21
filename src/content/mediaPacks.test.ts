import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  PRELOAD_ECHO_ITEMS,
  PRELOAD_LOOP_CLIPS,
  PRELOAD_WAVE_TRACKS,
} from '../config/balance'
import { evaluatePreloadGate } from './preloadGate'

const REPO_ROOT = process.cwd()

type ManifestItem = {
  readonly id: string
  readonly path: string
  readonly title: string
  readonly license: string
  readonly attribution: string
  readonly creatorLabel?: string
  readonly artistLabel?: string
  readonly pace?: string
  readonly kind?: string
}

function readJson<T>(relative: string): T {
  return JSON.parse(readFileSync(resolve(REPO_ROOT, relative), 'utf8')) as T
}

function resolvePackPath(packRoot: string, relativePath: string): string {
  return resolve(REPO_ROOT, packRoot, relativePath)
}

describe('content: starter + expanded pack counts validate; license/attribution fields present', () => {
  const loop = readJson<{ readonly clips: readonly ManifestItem[] }>(
    'content/loop/manifest.json',
  )
  const wave = readJson<{ readonly tracks: readonly ManifestItem[] }>(
    'content/wave/manifest.json',
  )
  const echo = readJson<{ readonly items: readonly ManifestItem[] }>(
    'content/echo/manifest.json',
  )

  it('meets starter counts from 06 and passes the preload gate', () => {
    expect(loop.clips.length).toBeGreaterThanOrEqual(PRELOAD_LOOP_CLIPS)
    expect(wave.tracks.length).toBeGreaterThanOrEqual(PRELOAD_WAVE_TRACKS)
    expect(echo.items.length).toBeGreaterThanOrEqual(PRELOAD_ECHO_ITEMS)

    // Expanded packs should go beyond the starter floor.
    expect(
      loop.clips.length + wave.tracks.length + echo.items.length,
    ).toBeGreaterThan(
      PRELOAD_LOOP_CLIPS + PRELOAD_WAVE_TRACKS + PRELOAD_ECHO_ITEMS,
    )

    expect(
      evaluatePreloadGate({
        loop: { clips: loop.clips },
        wave: { tracks: wave.tracks },
        echo: { items: echo.items },
      }),
    ).toEqual({ ok: true, errors: [] })
  })

  it('keeps license/attribution on every item and files on disk', () => {
    const missing: string[] = []

    for (const clip of loop.clips) {
      if (!clip.license?.trim()) missing.push(`${clip.id} missing license`)
      if (typeof clip.attribution !== 'string') {
        missing.push(`${clip.id} missing attribution field`)
      }
      const absolute = resolvePackPath('content/loop', clip.path)
      if (!existsSync(absolute)) missing.push(`${clip.id} → ${clip.path}`)
    }

    for (const track of wave.tracks) {
      if (!track.license?.trim()) missing.push(`${track.id} missing license`)
      if (typeof track.attribution !== 'string') {
        missing.push(`${track.id} missing attribution field`)
      }
      if (track.pace !== 'high' && track.pace !== 'boring') {
        missing.push(`${track.id} pace must be high|boring`)
      }
      const absolute = resolvePackPath('content/wave', track.path)
      if (!existsSync(absolute)) missing.push(`${track.id} → ${track.path}`)
    }

    const high = wave.tracks.filter((t) => t.pace === 'high').length
    const boring = wave.tracks.filter((t) => t.pace === 'boring').length
    expect(high).toBeGreaterThanOrEqual(2)
    expect(boring).toBeGreaterThanOrEqual(1)
    expect(boring).toBeLessThanOrEqual(1)

    for (const item of echo.items) {
      if (!item.license?.trim()) missing.push(`${item.id} missing license`)
      if (typeof item.attribution !== 'string') {
        missing.push(`${item.id} missing attribution field`)
      }
      const absolute = resolvePackPath('content/echo', item.path)
      if (!existsSync(absolute)) missing.push(`${item.id} → ${item.path}`)
    }

    expect(missing).toEqual([])
  })
})
