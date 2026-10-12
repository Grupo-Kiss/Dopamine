import {
  changeRunnerLane,
  createEndlessRunner,
  spawnCollectible,
  spawnObstacle,
  tickEndlessRunner,
} from './sim'

describe('Endless Runner', () => {
  it('auto-advances and exposes only three-lane selection', () => {
    const initial = createEndlessRunner()
    const moved = tickEndlessRunner(initial, {
      deltaMs: 1_000,
      difficultyMultiplier: 1,
    })

    expect(moved.distance).toBeGreaterThan(initial.distance)
    expect(changeRunnerLane(moved, 'left').playerLane).toBe('left')
    expect(changeRunnerLane(moved, 'right').playerLane).toBe('right')
  })

  it.each(['Static', 'Moving', 'Gap'] as const)(
    'resets only Runner state on %s obstacle collision',
    (obstacle) => {
      const state = spawnObstacle(
        createEndlessRunner(),
        'obstacle-1',
        'center',
        obstacle,
        0.01,
      )
      const failed = tickEndlessRunner(state, {
        deltaMs: 100,
        difficultyMultiplier: 1,
      })

      expect(failed.resetCount).toBe(1)
      expect(failed.events).toContainEqual({ type: 'Failure' })
      expect(failed).not.toHaveProperty('dopamine')
      expect(failed).not.toHaveProperty('score')
    },
  )

  it('collects rewards, signals rare pickups, and expires TTL', () => {
    let state = spawnCollectible(
      createEndlessRunner(),
      'rare-1',
      'left',
      'Rare',
      5_000,
      0.5,
    )
    expect(state.events).toContainEqual({
      type: 'AttentionRequest',
      reason: 'RarePickup',
    })

    state = changeRunnerLane(state, 'left')
    const collected = tickEndlessRunner(state, {
      deltaMs: 2_500,
      difficultyMultiplier: 1,
    })
    expect(collected.events).toContainEqual({
      type: 'Collectible',
      collectible: 'Rare',
    })

    const expiring = spawnCollectible(
      createEndlessRunner(),
      'coin-1',
      'right',
      'Coin',
      100,
    )
    expect(
      tickEndlessRunner(expiring, {
        deltaMs: 100,
        difficultyMultiplier: 1,
      }).entities,
    ).toHaveLength(0)
  })
})
