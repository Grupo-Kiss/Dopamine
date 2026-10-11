import {
  loadAssetBundle,
  type AssetManifestRepository,
  type MinigameAssetManifest,
} from './assets'
import { createLaneDefender } from './lane_defender/sim'

describe('asset-agnostic Minigame manifests', () => {
  it('resolves stable asset ids without exposing pixel dimensions to rules', async () => {
    const repository = createRepository({
      gameId: 'lane_defender',
      skinId: 'default',
      assets: {
        player: 'player_soldier.png',
        enemy: 'enemy_normal.png',
        boss: 'enemy_boss.png',
        barrier: 'hazard_barrier.png',
        mine: 'hazard_mine.png',
        pickup: 'pickup_score_mult.png',
        ground: 'ground.png',
        backdrop: 'backdrop.png',
      },
    })

    const bundle = await loadAssetBundle('lane_defender', repository)

    expect(bundle.resolve('player')).toBe('player_soldier.png')
    expect(bundle.resolve('boss')).toBe('enemy_boss.png')
    expect(bundle).not.toHaveProperty('width')
    expect(bundle).not.toHaveProperty('height')
  })

  it('can swap skins without changing Lane Defender rules', async () => {
    const first = await loadAssetBundle(
      'lane_defender',
      createRepository(manifestWithPrefix('default', 'v1')),
    )
    const alternate = await loadAssetBundle(
      'lane_defender',
      createRepository(manifestWithPrefix('neon', 'v2')),
    )

    expect(first.resolve('player')).not.toBe(alternate.resolve('player'))
    expect(createLaneDefender().lanes).toEqual(['left', 'center', 'right'])
    expect(createLaneDefender()).toEqual(createLaneDefender())
  })
})

function createRepository(
  manifest: MinigameAssetManifest,
): AssetManifestRepository {
  return {
    async load() {
      return manifest
    },
  }
}

function manifestWithPrefix(
  skinId: string,
  prefix: string,
): MinigameAssetManifest {
  return {
    gameId: 'lane_defender',
    skinId,
    assets: {
      player: `${prefix}/player.png`,
      enemy: `${prefix}/enemy.png`,
      boss: `${prefix}/boss.png`,
      barrier: `${prefix}/barrier.png`,
      mine: `${prefix}/mine.png`,
      pickup: `${prefix}/pickup.png`,
      ground: `${prefix}/ground.png`,
      backdrop: `${prefix}/backdrop.png`,
    },
  }
}
