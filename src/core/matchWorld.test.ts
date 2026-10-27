import postsStore from '../../content/pulse/posts.json'
import { WINDOW_REWARDS } from '../config/balance'
import { buildMatchStarterPack } from '../content/matchPack'
import { createFakeClock } from '../testing/clock'
import { createFakeMediaPort } from '../testing/media'
import { createSeededRng, createSequenceRng } from '../testing/rng'
import {
  applyWindowCommand,
  createMatchWorld,
  tickMatchWorld,
} from './matchWorld'

const PACK = buildMatchStarterPack({
  loopManifest: [{ id: 'loop_1', path: 'clips/a.webm', title: 'Clip A' }],
  waveManifest: [{ id: 'wave_1', durationMs: 60_000 }],
  echoManifest: [{ id: 'echo_1', moments: [{ atSec: 10 }] }],
  pulsePosts: postsStore.posts.slice(0, 5),
})

describe('Match world testground', () => {
  it('boots all service windows and the selected minigame', () => {
    const rng = createSequenceRng([0.2, 0.5, 0.5])
    const world = createMatchWorld(PACK, 'lane_defender', rng, createFakeClock(0))

    expect(world.loop.currentClip.id).toBe('loop_1')
    expect(world.pulse.timeline.length).toBeGreaterThan(0)
    expect(world.wave.currentTrack.id).toBe('wave_1')
    expect(world.echo.currentItem.id).toBe('echo_1')
    expect(world.minigame.id).toBe('lane_defender')
  })

  it('applies Pulse Like when that window is active', () => {
    const rng = createSequenceRng([0.2])
    const world = createMatchWorld(PACK, 'lane_defender', rng, createFakeClock(0))
    const clock = createFakeClock(0)
    const media = createFakeMediaPort()

    const result = applyWindowCommand(
      world,
      'Pulse',
      { type: 'Like' },
      clock,
      rng,
      media,
    )

    expect(result).toMatchObject({
      reward: WINDOW_REWARDS.Pulse.Like,
    })
  })

  it('ticks Wave playback and Echo timing for passive rewards', () => {
    const rng = createSeededRng(42)
    const clock = createFakeClock(0)
    let world = createMatchWorld(PACK, 'block_cascade', rng, clock)

    clock.advance(5_000)
    const ticked = tickMatchWorld(
      world,
      { deltaMs: 5_000, difficultyMultiplier: 1 },
      clock,
      rng,
    )
    world = ticked.world

    expect(world.echo.positionMs).toBe(5_000)
  })
})
