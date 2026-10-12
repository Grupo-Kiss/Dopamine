import type { MinigameId } from '../content/session'

export type MinigameAssetManifest = {
  readonly gameId: MinigameId
  readonly skinId: string
  readonly assets: Readonly<Record<string, string>>
}

export type AssetManifestRepository = {
  load(id: MinigameId): Promise<unknown>
}

export type AssetBundle = {
  readonly gameId: MinigameId
  readonly skinId: string
  resolve(id: string): string
}

export async function loadAssetBundle(
  id: MinigameId,
  repository: AssetManifestRepository,
): Promise<AssetBundle> {
  const manifest = parseManifest(await repository.load(id))

  if (manifest.gameId !== id) {
    throw new Error(
      `Requested ${id} but manifest belongs to ${manifest.gameId}`,
    )
  }

  return {
    gameId: manifest.gameId,
    skinId: manifest.skinId,
    resolve(assetId) {
      const path = manifest.assets[assetId]
      if (!path) {
        throw new Error(`Unknown ${manifest.gameId} asset id: ${assetId}`)
      }
      return path
    },
  }
}

function parseManifest(value: unknown): MinigameAssetManifest {
  if (!isRecord(value)) {
    throw new TypeError('Minigame asset manifest must be an object')
  }
  if (
    value.gameId !== 'lane_defender' &&
    value.gameId !== 'block_cascade' &&
    value.gameId !== 'endless_runner'
  ) {
    throw new TypeError('Minigame asset manifest has an invalid gameId')
  }
  if (typeof value.skinId !== 'string' || value.skinId.length === 0) {
    throw new TypeError('Minigame asset manifest requires skinId')
  }
  if (!isRecord(value.assets)) {
    throw new TypeError('Minigame asset manifest requires assets')
  }

  const assets = Object.fromEntries(
    Object.entries(value.assets).map(([assetId, path]) => {
      if (typeof path !== 'string' || path.length === 0) {
        throw new TypeError(`Asset ${assetId} requires a path`)
      }
      return [assetId, path]
    }),
  )

  return {
    gameId: value.gameId,
    skinId: value.skinId,
    assets,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
