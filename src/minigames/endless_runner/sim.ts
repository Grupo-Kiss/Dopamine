import { LANES, type Lane } from '../lane_defender/sim'

export type ObstacleKind = 'Static' | 'Moving' | 'Gap'
export type CollectibleKind = 'Coin' | 'Multiplier' | 'Shield' | 'Magnet' | 'Rare'
export type RunnerEntity =
  | { readonly id: string; readonly type: 'Obstacle'; readonly obstacle: ObstacleKind; readonly lane: Lane; readonly position: number }
  | { readonly id: string; readonly type: 'Collectible'; readonly collectible: CollectibleKind; readonly lane: Lane; readonly position: number; readonly expiresAtMs: number }
export type RunnerEvent =
  | { readonly type: 'Failure' }
  | { readonly type: 'Collectible'; readonly collectible: CollectibleKind }
  | { readonly type: 'AttentionRequest'; readonly reason: 'RarePickup' }
export type EndlessRunnerState = {
  readonly lanes: typeof LANES
  readonly playerLane: Lane
  readonly distance: number
  readonly elapsedMs: number
  readonly entities: readonly RunnerEntity[]
  readonly resetCount: number
  readonly events: readonly RunnerEvent[]
}

export function createEndlessRunner(): EndlessRunnerState {
  return { lanes: LANES, playerLane: 'center', distance: 0, elapsedMs: 0, entities: [], resetCount: 0, events: [] }
}

export function changeRunnerLane(state: EndlessRunnerState, playerLane: Lane): EndlessRunnerState {
  return { ...state, playerLane }
}

export function spawnObstacle(state: EndlessRunnerState, id: string, lane: Lane, obstacle: ObstacleKind, position = 1): EndlessRunnerState {
  return { ...state, entities: [...state.entities, { id, type: 'Obstacle', obstacle, lane, position }] }
}

export function spawnCollectible(state: EndlessRunnerState, id: string, lane: Lane, collectible: CollectibleKind, ttlMs: number, position = 1): EndlessRunnerState {
  const rareEvent: RunnerEvent[] = collectible === 'Rare' ? [{ type: 'AttentionRequest', reason: 'RarePickup' }] : []
  return {
    ...state,
    entities: [...state.entities, { id, type: 'Collectible', collectible, lane, position, expiresAtMs: state.elapsedMs + ttlMs }],
    events: [...state.events, ...rareEvent],
  }
}

export function tickEndlessRunner(state: EndlessRunnerState, tick: { readonly deltaMs: number; readonly difficultyMultiplier: number }): EndlessRunnerState {
  const elapsedMs = state.elapsedMs + tick.deltaMs
  const movement = 0.2 * tick.difficultyMultiplier * (tick.deltaMs / 1_000)
  const events = [...state.events]
  const survivors: RunnerEntity[] = []
  let failed = false

  for (const entity of state.entities) {
    if (entity.type === 'Collectible' && entity.expiresAtMs <= elapsedMs) continue
    const moved = { ...entity, position: entity.position - movement }
    if (moved.position > 0) {
      survivors.push(moved)
    } else if (moved.lane === state.playerLane && moved.type === 'Obstacle') {
      failed = true
    } else if (moved.lane === state.playerLane && moved.type === 'Collectible') {
      events.push({ type: 'Collectible', collectible: moved.collectible })
    }
  }

  if (failed) {
    return { ...createEndlessRunner(), resetCount: state.resetCount + 1, events: [{ type: 'Failure' }] }
  }
  return { ...state, elapsedMs, distance: state.distance + movement, entities: survivors, events }
}
