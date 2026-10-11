import type { AssetBundle } from '../assets'
import type { Lane } from '../lane_defender/sim'

const ASSET_IDS = ['player', 'obstacleStatic', 'obstacleMoving', 'collectible', 'rareCollectible', 'ground', 'parallaxFar', 'parallaxNear'] as const
type RunnerAssetId = (typeof ASSET_IDS)[number]

export function createEndlessRunnerView(assets: AssetBundle): Readonly<Record<RunnerAssetId, string>> {
  return Object.fromEntries(ASSET_IDS.map((id) => [id, assets.resolve(id)])) as Record<RunnerAssetId, string>
}

export function runnerLaneFromKeyboard(code: string): Lane | null {
  if (code === 'Digit1') return 'left'
  if (code === 'Digit2') return 'center'
  if (code === 'Digit3') return 'right'
  return null
}

export function runnerLaneFromSwipe(deltaX: number, current: Lane): Lane {
  const index = ['left', 'center', 'right'].indexOf(current)
  if (deltaX < 0) return (['left', 'center', 'right'] as const)[Math.max(0, index - 1)]!
  if (deltaX > 0) return (['left', 'center', 'right'] as const)[Math.min(2, index + 1)]!
  return current
}
