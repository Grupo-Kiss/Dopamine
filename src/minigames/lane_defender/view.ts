import type { AssetBundle } from '../assets'
import type { Lane } from './sim'

export const LANE_DEFENDER_ASSET_IDS = [
  'player',
  'enemy',
  'boss',
  'barrier',
  'mine',
  'pickup',
  'ground',
  'backdrop',
] as const

export type LaneDefenderAssetId = (typeof LANE_DEFENDER_ASSET_IDS)[number]

export type Letterbox = {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export type LaneDefenderView = {
  readonly viewport: Letterbox
  readonly sprites: Readonly<Record<LaneDefenderAssetId, string>>
}

export type AnimationFramePort = {
  request(callback: FrameRequestCallback): number
  cancel(id: number): void
}

const PLAYFIELD_ASPECT_RATIO = 3 / 4

export function createLaneDefenderView(
  assets: AssetBundle,
  canvasWidth: number,
  canvasHeight: number,
): LaneDefenderView {
  const sprites = Object.fromEntries(
    LANE_DEFENDER_ASSET_IDS.map((id) => [id, assets.resolve(id)]),
  ) as Record<LaneDefenderAssetId, string>

  return {
    viewport: letterboxPlayfield(canvasWidth, canvasHeight),
    sprites,
  }
}

export function letterboxPlayfield(
  containerWidth: number,
  containerHeight: number,
): Letterbox {
  assertPositive(containerWidth, 'Container width')
  assertPositive(containerHeight, 'Container height')

  const containerAspect = containerWidth / containerHeight
  const width =
    containerAspect > PLAYFIELD_ASPECT_RATIO
      ? containerHeight * PLAYFIELD_ASPECT_RATIO
      : containerWidth
  const height =
    containerAspect > PLAYFIELD_ASPECT_RATIO
      ? containerHeight
      : containerWidth / PLAYFIELD_ASPECT_RATIO

  return {
    x: (containerWidth - width) / 2,
    y: (containerHeight - height) / 2,
    width,
    height,
  }
}

export function laneFromKeyboard(code: string): Lane | null {
  if (code === 'Digit1') return 'left'
  if (code === 'Digit2') return 'center'
  if (code === 'Digit3') return 'right'
  return null
}

export function laneFromPointer(offsetX: number, playfieldWidth: number): Lane {
  assertPositive(playfieldWidth, 'Playfield width')
  if (!Number.isFinite(offsetX) || offsetX < 0 || offsetX >= playfieldWidth) {
    throw new RangeError('Pointer offset must be inside the playfield')
  }

  const laneIndex = Math.floor((offsetX / playfieldWidth) * 3)
  return (['left', 'center', 'right'] as const)[laneIndex]!
}

export function startLaneDefenderLoop(
  animationFrame: AnimationFramePort,
  tick: (deltaMs: number) => void,
  render: () => void,
): () => void {
  let previousTime: number | null = null
  let frameId = 0
  let stopped = false

  function frame(time: number): void {
    if (stopped) return

    if (previousTime !== null) {
      tick(time - previousTime)
    }
    render()
    previousTime = time
    frameId = animationFrame.request(frame)
  }

  frameId = animationFrame.request(frame)

  return () => {
    stopped = true
    animationFrame.cancel(frameId)
  }
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be positive and finite`)
  }
}
