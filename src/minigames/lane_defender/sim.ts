import type { Rng } from '../../testing/rng'

export const LANES = ['left', 'center', 'right'] as const
export type Lane = (typeof LANES)[number]

export type NormalEnemy = {
  readonly id: string
  readonly kind: 'NormalEnemy'
  readonly lane: Lane
  readonly position: number
}

export type Barrier = {
  readonly id: string
  readonly kind: 'Barrier'
  readonly lane: Lane
  readonly position: number
  readonly counter: number
}

export type Mine = {
  readonly id: string
  readonly kind: 'Mine'
  readonly lane: Lane
  readonly position: number
  readonly counter: number
}

export type Boss = {
  readonly id: string
  readonly kind: 'Boss'
  readonly lane: 'all'
  readonly position: number
  readonly integrity: number
}

export type PickupKind =
  | 'ScoreMultiplier'
  | 'RapidFire'
  | 'PiercingShot'
  | 'WideShot'
  | 'Shield'
  | 'Magnet'

export type Pickup = {
  readonly id: string
  readonly kind: 'Pickup'
  readonly lane: Lane
  readonly position: number
  readonly pickup: PickupKind
  readonly expiresAtMs: number
}

export type LaneEntity = NormalEnemy | Barrier | Mine | Boss | Pickup

export type LaneDefenderEvent =
  | { readonly type: 'NormalEnemyDefeated'; readonly id: string }
  | {
      readonly type: 'AttentionRequest'
      readonly reason: 'BossSpawned' | 'RarePickup'
    }
  | {
      readonly type: 'BossDefeated'
      readonly rewards: {
        readonly dopamine: 'BossReward'
        readonly score: 'BossReward'
        readonly temporaryScoreMultiplier: true
      }
    }
  | { readonly type: 'MineActivated'; readonly id: string }
  | { readonly type: 'Failure' }

export type LaneDefenderState = {
  readonly lanes: typeof LANES
  readonly playerLane: Lane
  readonly entities: readonly LaneEntity[]
  readonly barrierBlocks: number
  readonly elapsedMs: number
  readonly resetCount: number
  readonly events: readonly LaneDefenderEvent[]
}

export type LaneDefenderTick = {
  readonly deltaMs: number
  readonly difficultyMultiplier: number
}

const NORMALIZED_SPEED_PER_SECOND = 0.2
const BASE_SPAWN_INTERVAL_MS = 1_200

export function createLaneDefender(): LaneDefenderState {
  return {
    lanes: LANES,
    playerLane: 'center',
    entities: [],
    barrierBlocks: 0,
    elapsedMs: 0,
    resetCount: 0,
    events: [],
  }
}

export function changeLane(
  state: LaneDefenderState,
  lane: Lane,
): LaneDefenderState {
  return { ...state, playerLane: lane }
}

export function spawnNormalEnemy(
  state: LaneDefenderState,
  rng: Rng,
  id: string,
  position = 1,
): LaneDefenderState {
  return addEntity(state, {
    id,
    kind: 'NormalEnemy',
    lane: randomLane(rng),
    position,
  })
}

export function spawnBarrier(
  state: LaneDefenderState,
  id: string,
  lane: Lane,
  counter: number,
  position = 1,
): LaneDefenderState {
  return addEntity(state, {
    id,
    kind: 'Barrier',
    lane,
    counter,
    position,
  })
}

export function spawnMine(
  state: LaneDefenderState,
  id: string,
  lane: Lane,
  counter: number,
  position = 1,
): LaneDefenderState {
  return addEntity(state, {
    id,
    kind: 'Mine',
    lane,
    counter,
    position,
  })
}

export function spawnBoss(
  state: LaneDefenderState,
  id: string,
  integrity: number,
  position = 1,
): LaneDefenderState {
  if (!Number.isSafeInteger(integrity) || integrity < 1) {
    throw new RangeError('Boss integrity must be a positive integer')
  }

  return {
    ...addEntity(state, {
      id,
      kind: 'Boss',
      lane: 'all',
      integrity,
      position,
    }),
    events: [
      ...state.events,
      { type: 'AttentionRequest', reason: 'BossSpawned' },
    ],
  }
}

export function spawnPickup(
  state: LaneDefenderState,
  id: string,
  lane: Lane,
  pickup: PickupKind,
  ttlMs: number,
  position = 1,
): LaneDefenderState {
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    throw new RangeError('Pickup TTL must be positive')
  }

  return addEntity(state, {
    id,
    kind: 'Pickup',
    lane,
    pickup,
    position,
    expiresAtMs: state.elapsedMs + ttlMs,
  })
}

export function autoFire(state: LaneDefenderState): LaneDefenderState {
  const target = [...state.entities]
    .filter(
      (entity) =>
        entity.kind !== 'Pickup' &&
        (entity.lane === state.playerLane || entity.lane === 'all'),
    )
    .sort((left, right) => left.position - right.position)[0]

  if (!target) {
    return state
  }

  if (target.kind === 'NormalEnemy') {
    return {
      ...state,
      entities: removeEntity(state.entities, target.id),
      events: [...state.events, { type: 'NormalEnemyDefeated', id: target.id }],
    }
  }

  if (target.kind === 'Barrier') {
    return replaceEntity(state, { ...target, counter: target.counter + 1 })
  }

  if (target.kind === 'Mine') {
    const counter = target.counter + 1
    return counter >= 0
      ? {
          ...state,
          entities: removeEntity(state.entities, target.id),
          events: [...state.events, { type: 'MineActivated', id: target.id }],
        }
      : replaceEntity(state, { ...target, counter })
  }

  if (target.kind === 'Pickup') {
    return state
  }

  const integrity = target.integrity - 1
  return integrity === 0
    ? {
        ...state,
        entities: removeEntity(state.entities, target.id),
        events: [
          ...state.events,
          {
            type: 'BossDefeated',
            rewards: {
              dopamine: 'BossReward',
              score: 'BossReward',
              temporaryScoreMultiplier: true,
            },
          },
        ],
      }
    : replaceEntity(state, { ...target, integrity })
}

export function tickLaneDefender(
  state: LaneDefenderState,
  tick: LaneDefenderTick,
): LaneDefenderState {
  assertPositiveFinite(tick.deltaMs, 'Tick delta')
  assertPositiveFinite(tick.difficultyMultiplier, 'Difficulty multiplier')

  const elapsedMs = state.elapsedMs + tick.deltaMs
  const movement =
    NORMALIZED_SPEED_PER_SECOND *
    tick.difficultyMultiplier *
    (tick.deltaMs / 1_000)
  const moved = state.entities
    .filter(
      (entity) => entity.kind !== 'Pickup' || entity.expiresAtMs > elapsedMs,
    )
    .map((entity) =>
      entity.kind === 'Pickup'
        ? entity
        : { ...entity, position: entity.position - movement },
    )

  let barrierBlocks = state.barrierBlocks
  let failed = false
  const survivors: LaneEntity[] = []

  for (const entity of moved) {
    if (entity.position > 0 || entity.kind === 'Pickup') {
      survivors.push(entity)
      continue
    }

    if (entity.kind === 'Barrier') {
      if (entity.counter < 0) {
        failed = true
      } else if (entity.counter > 0) {
        barrierBlocks += entity.counter
      }
      continue
    }

    if (entity.kind === 'Mine') {
      if (entity.counter < 0) {
        failed = true
      }
      continue
    }

    if (barrierBlocks > 0) {
      barrierBlocks -= 1
      continue
    }

    failed = true
  }

  if (failed) {
    return {
      ...createLaneDefender(),
      resetCount: state.resetCount + 1,
      events: [{ type: 'Failure' }],
    }
  }

  return {
    ...state,
    elapsedMs,
    entities: survivors,
    barrierBlocks,
  }
}

export function spawnIntervalMs(difficultyMultiplier: number): number {
  assertPositiveFinite(difficultyMultiplier, 'Difficulty multiplier')
  return BASE_SPAWN_INTERVAL_MS / difficultyMultiplier
}

function randomLane(rng: Rng): Lane {
  const lane = LANES[Math.floor(rng.next() * LANES.length)]
  if (!lane) {
    throw new RangeError('RNG value must be in [0, 1)')
  }
  return lane
}

function addEntity(
  state: LaneDefenderState,
  entity: LaneEntity,
): LaneDefenderState {
  return { ...state, entities: [...state.entities, entity] }
}

function replaceEntity(
  state: LaneDefenderState,
  replacement: LaneEntity,
): LaneDefenderState {
  return {
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === replacement.id ? replacement : entity,
    ),
  }
}

function removeEntity(
  entities: readonly LaneEntity[],
  id: string,
): LaneEntity[] {
  return entities.filter((entity) => entity.id !== id)
}

function assertPositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be positive and finite`)
  }
}
