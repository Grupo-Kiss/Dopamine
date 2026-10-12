import { createSequenceRng } from '../../testing/rng'
import {
  autoFire,
  changeLane,
  createLaneDefender,
  spawnBarrier,
  spawnBoss,
  spawnIntervalMs,
  spawnNormalEnemy,
  spawnPickup,
  tickLaneDefender,
} from './sim'

describe('Lane Defender simulation', () => {
  it('has exactly three lanes and changes lane instantaneously', () => {
    const initial = createLaneDefender()

    expect(initial.lanes).toEqual(['left', 'center', 'right'])
    expect(initial.playerLane).toBe('center')
    expect(changeLane(initial, 'left').playerLane).toBe('left')
    expect(changeLane(initial, 'right').playerLane).toBe('right')
  })

  it('spawns with injected RNG and destroys a normal enemy in one hit', () => {
    const spawned = spawnNormalEnemy(
      createLaneDefender(),
      createSequenceRng([0.1]),
      'enemy-1',
    )
    const aimed = changeLane(spawned, 'left')
    const fired = autoFire(aimed)

    expect(spawned.entities[0]).toMatchObject({
      id: 'enemy-1',
      kind: 'NormalEnemy',
      lane: 'left',
    })
    expect(fired.entities).toHaveLength(0)
    expect(fired.events).toContainEqual({
      type: 'NormalEnemyDefeated',
      id: 'enemy-1',
    })
  })

  it('resets only its simulation when an enemy reaches the player', () => {
    const spawned = spawnNormalEnemy(
      createLaneDefender(),
      createSequenceRng([0.5]),
      'enemy-1',
      0.001,
    )
    const failed = tickLaneDefender(spawned, {
      deltaMs: 100,
      difficultyMultiplier: 1,
    })

    expect(failed.entities).toHaveLength(0)
    expect(failed.playerLane).toBe('center')
    expect(failed.resetCount).toBe(1)
    expect(failed.events).toContainEqual({ type: 'Failure' })
  })

  it('increments Barrier counters with shots and fails if negative on reach', () => {
    const barrier = spawnBarrier(
      createLaneDefender(),
      'barrier-1',
      'center',
      -2,
      0.001,
    )
    const shotOnce = autoFire(barrier)
    expect(shotOnce.entities[0]).toMatchObject({ counter: -1 })

    const failed = tickLaneDefender(shotOnce, {
      deltaMs: 100,
      difficultyMultiplier: 1,
    })
    expect(failed.events).toContainEqual({ type: 'Failure' })
  })

  it('turns a positive Barrier into N enemy blocks', () => {
    let state = spawnBarrier(
      createLaneDefender(),
      'barrier-1',
      'center',
      -1,
      0.001,
    )
    state = autoFire(state)
    state = autoFire(state)
    state = tickLaneDefender(state, {
      deltaMs: 100,
      difficultyMultiplier: 1,
    })
    expect(state.barrierBlocks).toBe(1)

    state = spawnNormalEnemy(state, createSequenceRng([0.5]), 'enemy-1', 0.001)
    state = tickLaneDefender(state, {
      deltaMs: 100,
      difficultyMultiplier: 1,
    })

    expect(state.barrierBlocks).toBe(0)
    expect(state.events).not.toContainEqual({ type: 'Failure' })
  })

  it('requires multiple hits for boss integrity and emits reward hooks', () => {
    let state = spawnBoss(createLaneDefender(), 'boss-1', 3)

    expect(state.events).toContainEqual({
      type: 'AttentionRequest',
      reason: 'BossSpawned',
    })
    state = autoFire(state)
    state = autoFire(state)
    expect(state.entities[0]).toMatchObject({ integrity: 1 })

    state = autoFire(state)
    expect(state.entities).toHaveLength(0)
    expect(state.events).toContainEqual({
      type: 'BossDefeated',
      rewards: {
        dopamine: 'BossReward',
        score: 'BossReward',
        temporaryScoreMultiplier: true,
      },
    })
  })

  it('expires pickups and increases spawn density continuously', () => {
    const pickup = spawnPickup(
      createLaneDefender(),
      'pickup-1',
      'left',
      'RapidFire',
      1_000,
    )
    const alive = tickLaneDefender(pickup, {
      deltaMs: 999,
      difficultyMultiplier: 1,
    })
    const expired = tickLaneDefender(alive, {
      deltaMs: 1,
      difficultyMultiplier: 1,
    })

    expect(alive.entities).toHaveLength(1)
    expect(expired.entities).toHaveLength(0)
    expect(spawnIntervalMs(2)).toBeLessThan(spawnIntervalMs(1))
    expect(spawnIntervalMs(2)).toBeGreaterThan(0)
  })
})
