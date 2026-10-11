import {
  DISCOVERY_HEARD_TRACK_MULT,
  WINDOW_REWARDS,
} from '../config/balance'
import { createSequenceRng } from '../testing/rng'
import { createFakeMediaPort } from '../testing/media'
import {
  acceptWaveRecommendation,
  createWave,
  leaveWave,
  likeWaveTrack,
  onWaveTrackEnded,
  raiseWaveRecommendation,
  skipWaveTrack,
  tickWave,
  tickWavePlayback,
} from './wave'

const tracks = [
  { id: 'wave-a', durationMs: 100_000 },
  { id: 'wave-b', durationMs: 100_000 },
  { id: 'wave-c', durationMs: 100_000 },
]

describe('Wave playback', () => {
  it('auto-advances on end and lets N skip immediately', async () => {
    const media = createFakeMediaPort()
    const rng = createSequenceRng([0.5, 0.5, 0.5])
    const initial = createWave(tracks, rng)

    const ended = await onWaveTrackEnded(initial, media, rng)
    expect(ended.state.currentTrack.id).toBe('wave-b')

    const skipped = await skipWaveTrack(ended.state, media, rng)
    expect(skipped.state.currentTrack.id).toBe('wave-c')
    expect(media.calls).toEqual([
      { operation: 'play', id: 'wave-b' },
      { operation: 'play', id: 'wave-c' },
    ])
  })
})

describe('Wave Discovery Bonus — novelty only', () => {
  it('grows only on consecutive skips onto unheard tracks', async () => {
    const media = createFakeMediaPort()
    const rng = createSequenceRng([0.5, 0.5, 0.5, 0.5])
    let state = createWave(tracks, rng)

    const first = await skipWaveTrack(state, media, rng)
    state = first.state
    const second = await skipWaveTrack(state, media, rng)
    state = second.state
    const heard = await skipWaveTrack(state, media, rng)

    expect(first.discoveryBonus.kind).toBe('DiscoveryBonus')
    expect(first.discoveryBonus.value).toBeGreaterThan(0)
    expect(second.discoveryBonus.value).toBeGreaterThan(
      first.discoveryBonus.value,
    )
    expect(heard.discoveryBonus.value).toBe(
      first.discoveryBonus.value * DISCOVERY_HEARD_TRACK_MULT,
    )
    expect(heard.state.discovery.streak).toBe(0)
    expect(heard.state.anticipation).toMatchObject({
      kind: 'AnticipationBonus',
      value: 0,
    })
  })
})

describe('Wave Anticipation Bonus — waiting only', () => {
  it('builds toward Song Moment, pays on landing, and stays distinct', () => {
    const rng = createSequenceRng([0.5])
    const initial = createWave([tracks[0]!], rng)
    const waiting = tickWavePlayback(initial, 10_000)

    expect(waiting.state.anticipation.kind).toBe('AnticipationBonus')
    expect(waiting.state.anticipation.value).toBeGreaterThan(0)
    expect(waiting.state.discovery).toEqual({
      kind: 'DiscoveryBonus',
      streak: 0,
      value: 0,
    })

    const landed = tickWavePlayback(waiting.state, 40_000)
    expect(landed.songMomentLanded).toBe(true)
    expect(landed.reward.dopamine).toBeGreaterThan(
      WINDOW_REWARDS.Wave.SongMoment.dopamine,
    )
    expect(landed.state.anticipation.value).toBe(0)
    expect(landed.state.discovery.value).toBe(0)
  })

  it('resets Anticipation and Discovery when leaving Wave', () => {
    const rng = createSequenceRng([0.5])
    const waiting = tickWavePlayback(createWave([tracks[0]!], rng), 10_000)

    expect(leaveWave(waiting.state).anticipation.value).toBe(0)
    expect(leaveWave(waiting.state).discovery.value).toBe(0)
  })
})

describe('Wave recommendations and likes', () => {
  it('models recommendations as expiring Attention Requests without penalty', async () => {
    const media = createFakeMediaPort()
    const rng = createSequenceRng([0.5, 0.5])
    const initial = createWave(tracks, rng)
    const request = raiseWaveRecommendation(initial, 'wave-c', 1_000)

    expect(request.recommendation).toEqual({
      trackId: 'wave-c',
      expiresAtMs: 1_000,
    })
    expect(tickWave(request, 1_000).recommendation).toBeNull()
    expect(tickWave(request, 1_000)).not.toHaveProperty('dopaminePenalty')

    const accepted = await acceptWaveRecommendation(
      request,
      999,
      media,
      rng,
    )
    expect(accepted.reward.dopamine).toBeGreaterThanOrEqual(
      WINDOW_REWARDS.Wave.Recommendation.dopamine,
    )
    expect(accepted.state.currentTrack.id).toBe('wave-c')
  })

  it('rewards a track Like once', () => {
    const state = createWave(tracks, createSequenceRng([0.5]))
    const liked = likeWaveTrack(state)
    const repeated = likeWaveTrack(liked.state)

    expect(liked.reward).toEqual(WINDOW_REWARDS.Wave.Like)
    expect(repeated.reward).toEqual({ dopamine: 0, score: 0 })
  })
})
