import {
  PRELOAD_ECHO_ITEMS,
  PRELOAD_LOOP_CLIPS,
  PRELOAD_WAVE_TRACKS,
} from '../config/balance'
import {
  evaluatePreloadGate,
  runPreloadGate,
  type ContentPack,
} from './preloadGate'

describe('content preload gate', () => {
  it('fails closed when a queued manifest item lacks license metadata', () => {
    const pack = createStarterPack()
    const invalid: ContentPack = {
      ...pack,
      loop: {
        clips: pack.loop.clips.map((clip, index) =>
          index === 0 ? { ...clip, license: undefined } : clip,
        ),
      },
    }
    const loadingComplete = vi.fn()

    const result = runPreloadGate(invalid, loadingComplete)

    expect(result.ok).toBe(false)
    expect(result.errors).toContain('loop.clips[0].license is required')
    expect(loadingComplete).not.toHaveBeenCalled()
  })

  it('blocks Playing until all starter counts from 06 are met', () => {
    const pack = createStarterPack()
    const shortPack: ContentPack = {
      ...pack,
      wave: { tracks: pack.wave.tracks.slice(1) },
    }
    const loadingComplete = vi.fn()

    expect(evaluatePreloadGate(shortPack)).toMatchObject({ ok: false })
    expect(runPreloadGate(shortPack, loadingComplete).ok).toBe(false)
    expect(loadingComplete).not.toHaveBeenCalled()

    expect(runPreloadGate(pack, loadingComplete)).toEqual({
      ok: true,
      errors: [],
    })
    expect(loadingComplete).toHaveBeenCalledOnce()
  })
})

function createStarterPack() {
  return {
    loop: {
      clips: Array.from({ length: PRELOAD_LOOP_CLIPS }, (_, index) => ({
        id: `loop-${index}`,
        path: `clips/${index}.webm`,
        title: `Loop ${index}`,
        creatorLabel: `Creator ${index}`,
        license: 'owned',
        attribution: '',
      })),
    },
    wave: {
      tracks: Array.from({ length: PRELOAD_WAVE_TRACKS }, (_, index) => ({
        id: `wave-${index}`,
        path: `high/${index}.mp3`,
        title: `Wave ${index}`,
        artistLabel: `Artist ${index}`,
        license: 'CC0',
        attribution: `Artist ${index} — CC0`,
      })),
    },
    echo: {
      items: Array.from({ length: PRELOAD_ECHO_ITEMS }, (_, index) => ({
        id: `echo-${index}`,
        path: `audio/${index}.mp3`,
        title: `Echo ${index}`,
        creatorLabel: `Creator ${index}`,
        license: 'owned',
        attribution: '',
      })),
    },
  }
}
