import {
  PRELOAD_ECHO_ITEMS,
  PRELOAD_LOOP_CLIPS,
  PRELOAD_WAVE_TRACKS,
} from '../config/balance'

export type ContentPack = {
  readonly loop: { readonly clips: readonly unknown[] }
  readonly wave: { readonly tracks: readonly unknown[] }
  readonly echo: { readonly items: readonly unknown[] }
}

export type PreloadGateResult =
  | { readonly ok: true; readonly errors: readonly [] }
  | { readonly ok: false; readonly errors: readonly string[] }

export function evaluatePreloadGate(
  pack: ContentPack,
): PreloadGateResult {
  const errors = [
    ...validateItems('loop.clips', pack.loop.clips),
    ...validateItems('wave.tracks', pack.wave.tracks),
    ...validateItems('echo.items', pack.echo.items),
  ]

  validateCount(
    errors,
    'loop.clips',
    pack.loop.clips.length,
    PRELOAD_LOOP_CLIPS,
  )
  validateCount(
    errors,
    'wave.tracks',
    pack.wave.tracks.length,
    PRELOAD_WAVE_TRACKS,
  )
  validateCount(
    errors,
    'echo.items',
    pack.echo.items.length,
    PRELOAD_ECHO_ITEMS,
  )

  return errors.length === 0
    ? { ok: true, errors: [] }
    : { ok: false, errors }
}

export function runPreloadGate(
  pack: ContentPack,
  loadingComplete: () => void,
): PreloadGateResult {
  const result = evaluatePreloadGate(pack)

  if (result.ok) {
    loadingComplete()
  }

  return result
}

function validateItems(
  collectionPath: string,
  items: readonly unknown[],
): string[] {
  return items.flatMap((item, index) =>
    validateItem(item, `${collectionPath}[${index}]`),
  )
}

function validateItem(item: unknown, path: string): string[] {
  if (!isRecord(item)) {
    return [`${path} must be an object`]
  }

  const errors: string[] = []
  requireNonEmptyString(errors, item, path, 'id')
  requireNonEmptyString(errors, item, path, 'path')
  requireNonEmptyString(errors, item, path, 'title')
  requireNonEmptyString(errors, item, path, 'license')
  requireString(errors, item, path, 'attribution')

  const hasCreator =
    typeof item.creatorLabel === 'string' &&
    item.creatorLabel.trim().length > 0
  const hasArtist =
    typeof item.artistLabel === 'string' &&
    item.artistLabel.trim().length > 0
  if (!hasCreator && !hasArtist) {
    errors.push(`${path}.creatorLabel or artistLabel is required`)
  }

  return errors
}

function requireNonEmptyString(
  errors: string[],
  item: Record<string, unknown>,
  path: string,
  key: string,
): void {
  if (typeof item[key] !== 'string' || item[key].trim().length === 0) {
    errors.push(`${path}.${key} is required`)
  }
}

function requireString(
  errors: string[],
  item: Record<string, unknown>,
  path: string,
  key: string,
): void {
  if (typeof item[key] !== 'string') {
    errors.push(`${path}.${key} is required`)
  }
}

function validateCount(
  errors: string[],
  collectionPath: string,
  actual: number,
  required: number,
): void {
  if (actual < required) {
    errors.push(
      `${collectionPath} needs ${required} starter items; received ${actual}`,
    )
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
