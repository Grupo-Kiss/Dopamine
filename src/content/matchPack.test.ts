import { buildMatchStarterPack } from './matchPack'

describe('Match starter pack adapters', () => {
  it('maps echo manifest moments into playback timing', () => {
    const pack = buildMatchStarterPack({
      loopManifest: [{ id: 'loop_1', path: 'clips/a.webm' }],
      waveManifest: [{ id: 'wave_1', title: 'Track' }],
      echoManifest: [
        {
          id: 'echo_1',
          moments: [{ atSec: 12 }, { atSec: 40 }],
        },
      ],
      pulsePosts: [
        {
          id: 'p1',
          userId: 'u',
          body: 'hello',
          category: 'other',
          rewardable: true,
        },
      ],
    })

    expect(pack.echoItems[0]).toEqual({
      id: 'echo_1',
      highlightAtMs: 12_000,
      durationMs: 55_000,
    })
    expect(pack.waveTracks[0]?.durationMs).toBe(90_000)
  })
})
