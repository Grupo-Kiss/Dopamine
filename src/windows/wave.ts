import {
  DISCOVERY_CAP_VS_DIRECT_MULT,
  DISCOVERY_HEARD_TRACK_MULT,
  DISCOVERY_LOG_BASE,
  DISCOVERY_STEP_DOPAMINE,
  WINDOW_REWARDS,
} from '../config/balance'
import {
  buildAnticipationBonus,
  createAnticipationBonus,
  resetAnticipationBonus,
  type AnticipationBonus,
} from '../core/dopamine'
import type { MediaPort } from '../testing/media'
import type { Rng } from '../testing/rng'
import type { Reward } from './loop'

export type WaveTrack = {
  readonly id: string
  readonly durationMs: number
}

export type DiscoveryBonus = {
  readonly kind: 'DiscoveryBonus'
  readonly streak: number
  readonly value: number
}

export type WaveState = {
  readonly tracks: readonly WaveTrack[]
  readonly currentIndex: number
  readonly currentTrack: WaveTrack
  readonly heardTrackIds: ReadonlySet<string>
  readonly likedTrackIds: ReadonlySet<string>
  readonly positionMs: number
  readonly songMomentAtMs: number
  readonly songMomentLanded: boolean
  readonly discovery: DiscoveryBonus
  readonly anticipation: AnticipationBonus
  readonly recommendation: {
    readonly trackId: string
    readonly expiresAtMs: number
  } | null
}

export type WaveTransition = {
  readonly state: WaveState
  readonly reward: Reward
  readonly discoveryBonus: DiscoveryBonus
}

export type WavePlaybackTick = {
  readonly state: WaveState
  readonly reward: Reward
  readonly songMomentLanded: boolean
}

const NO_REWARD: Reward = { dopamine: 0, score: 0 }

export function createWave(
  tracks: readonly WaveTrack[],
  rng: Rng,
): WaveState {
  const currentTrack = tracks[0]
  if (!currentTrack) {
    throw new Error('Wave requires at least one track')
  }
  validateTrack(currentTrack)

  return {
    tracks,
    currentIndex: 0,
    currentTrack,
    heardTrackIds: new Set([currentTrack.id]),
    likedTrackIds: new Set(),
    positionMs: 0,
    songMomentAtMs: songMomentFor(currentTrack, rng),
    songMomentLanded: false,
    discovery: createDiscoveryBonus(),
    anticipation: createAnticipationBonus(),
    recommendation: null,
  }
}

export async function onWaveTrackEnded(
  state: WaveState,
  media: MediaPort,
  rng: Rng,
): Promise<WaveTransition> {
  const nextIndex = (state.currentIndex + 1) % state.tracks.length
  return transitionToTrack(state, nextIndex, 'Ended', media, rng)
}

export async function skipWaveTrack(
  state: WaveState,
  media: MediaPort,
  rng: Rng,
): Promise<WaveTransition> {
  const nextIndex = (state.currentIndex + 1) % state.tracks.length
  return transitionToTrack(state, nextIndex, 'Skip', media, rng)
}

export function tickWavePlayback(
  state: WaveState,
  deltaMs: number,
): WavePlaybackTick {
  if (!Number.isFinite(deltaMs) || deltaMs < 0) {
    throw new RangeError('Wave playback delta must be non-negative')
  }
  if (deltaMs === 0 || state.songMomentLanded) {
    return { state, reward: NO_REWARD, songMomentLanded: false }
  }

  const positionMs = Math.min(
    state.currentTrack.durationMs,
    state.positionMs + deltaMs,
  )
  const anticipation = buildAnticipationBonus(
    state.anticipation,
    WINDOW_REWARDS.Wave.SongMoment.dopamine,
  )
  const landed =
    state.positionMs < state.songMomentAtMs &&
    positionMs >= state.songMomentAtMs

  if (landed) {
    return {
      state: {
        ...state,
        positionMs,
        songMomentLanded: true,
        anticipation: resetAnticipationBonus(
          anticipation,
          'obtained',
        ),
      },
      reward: {
        dopamine:
          WINDOW_REWARDS.Wave.SongMoment.dopamine + anticipation.value,
        score: WINDOW_REWARDS.Wave.SongMoment.score,
      },
      songMomentLanded: true,
    }
  }

  return {
    state: { ...state, positionMs, anticipation },
    reward: NO_REWARD,
    songMomentLanded: false,
  }
}

export function leaveWave(state: WaveState): WaveState {
  return {
    ...state,
    discovery: createDiscoveryBonus(),
    anticipation: resetAnticipationBonus(state.anticipation, 'left'),
  }
}

export function likeWaveTrack(
  state: WaveState,
): { readonly state: WaveState; readonly reward: Reward } {
  if (state.likedTrackIds.has(state.currentTrack.id)) {
    return { state, reward: NO_REWARD }
  }

  return {
    state: {
      ...state,
      likedTrackIds: new Set([
        ...state.likedTrackIds,
        state.currentTrack.id,
      ]),
    },
    reward: WINDOW_REWARDS.Wave.Like,
  }
}

export function raiseWaveRecommendation(
  state: WaveState,
  trackId: string,
  expiresAtMs: number,
): WaveState {
  if (!state.tracks.some((track) => track.id === trackId)) {
    throw new Error(`Unknown Wave recommendation: ${trackId}`)
  }
  return { ...state, recommendation: { trackId, expiresAtMs } }
}

export function tickWave(state: WaveState, nowMs: number): WaveState {
  return state.recommendation &&
    nowMs >= state.recommendation.expiresAtMs
    ? { ...state, recommendation: null }
    : state
}

export async function acceptWaveRecommendation(
  state: WaveState,
  nowMs: number,
  media: MediaPort,
  rng: Rng,
): Promise<WaveTransition> {
  if (!state.recommendation || nowMs >= state.recommendation.expiresAtMs) {
    return {
      state: tickWave(state, nowMs),
      reward: NO_REWARD,
      discoveryBonus: createDiscoveryBonus(),
    }
  }

  const index = state.tracks.findIndex(
    (track) => track.id === state.recommendation?.trackId,
  )
  const resetState = { ...state, discovery: createDiscoveryBonus() }
  const transition = await transitionToTrack(
    resetState,
    index,
    'Recommendation',
    media,
    rng,
  )

  return {
    ...transition,
    reward: {
      dopamine:
        WINDOW_REWARDS.Wave.Recommendation.dopamine +
        transition.discoveryBonus.value,
      score: WINDOW_REWARDS.Wave.Recommendation.score,
    },
  }
}

function createDiscoveryBonus(): DiscoveryBonus {
  return { kind: 'DiscoveryBonus', streak: 0, value: 0 }
}

function discoveryFor(
  previous: DiscoveryBonus,
  unheard: boolean,
): DiscoveryBonus {
  if (!unheard) {
    return {
      kind: 'DiscoveryBonus',
      streak: 0,
      value: previous.value * DISCOVERY_HEARD_TRACK_MULT,
    }
  }

  const streak = previous.streak + 1
  const value = Math.min(
    WINDOW_REWARDS.Wave.Recommendation.dopamine *
      DISCOVERY_CAP_VS_DIRECT_MULT,
    DISCOVERY_STEP_DOPAMINE *
      (Math.log(streak + DISCOVERY_LOG_BASE - 1) /
        Math.log(DISCOVERY_LOG_BASE)),
  )
  return { kind: 'DiscoveryBonus', streak, value }
}

async function transitionToTrack(
  state: WaveState,
  index: number,
  reason: 'Ended' | 'Skip' | 'Recommendation',
  media: MediaPort,
  rng: Rng,
): Promise<WaveTransition> {
  const currentTrack = state.tracks[index]
  if (!currentTrack) {
    throw new Error('Wave transition selected an unknown track')
  }
  validateTrack(currentTrack)

  const unheard = !state.heardTrackIds.has(currentTrack.id)
  const discoveryBonus =
    reason === 'Ended'
      ? createDiscoveryBonus()
      : discoveryFor(state.discovery, unheard)
  const directReward =
    reason === 'Skip'
      ? unheard
        ? WINDOW_REWARDS.Wave.SkipUnheard
        : WINDOW_REWARDS.Wave.SkipHeard
      : NO_REWARD

  await media.play(currentTrack.id)

  return {
    state: {
      ...state,
      currentIndex: index,
      currentTrack,
      heardTrackIds: new Set([...state.heardTrackIds, currentTrack.id]),
      positionMs: 0,
      songMomentAtMs: songMomentFor(currentTrack, rng),
      songMomentLanded: false,
      discovery: discoveryBonus,
      anticipation: resetAnticipationBonus(
        state.anticipation,
        reason === 'Ended' ? 'expired' : 'left',
      ),
      recommendation: null,
    },
    reward: {
      dopamine: directReward.dopamine + discoveryBonus.value,
      score: directReward.score,
    },
    discoveryBonus,
  }
}

function songMomentFor(track: WaveTrack, rng: Rng): number {
  return track.durationMs * (0.25 + rng.next() * 0.5)
}

function validateTrack(track: WaveTrack): void {
  if (!Number.isFinite(track.durationMs) || track.durationMs <= 0) {
    throw new RangeError(`Wave track ${track.id} needs positive duration`)
  }
}
