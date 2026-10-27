import { useEffect, useRef } from 'react'

import { loadAssetBundle } from '../../minigames/assets'
import type { MinigameSimState } from '../../core/matchWorld'
import type { MinigameId } from '../../content/session'
import { laneFromPointer, letterboxPlayfield } from '../../minigames/lane_defender/view'
import type { LaneEntity } from '../../minigames/lane_defender/sim'
import laneDefenderManifest from '../../../content/minigames/lane_defender/manifest.json'

import './testground.css'

export type MinigameSurfaceProps = {
  readonly minigameId: MinigameId
  readonly minigame: MinigameSimState
  readonly onLanePointer?: (offsetX: number, playfieldWidth: number) => void
}

export function MinigameSurface({
  minigameId,
  minigame,
  onLanePointer,
}: MinigameSurfaceProps) {
  if (minigame.id === 'lane_defender') {
    return (
      <LaneDefenderCanvas
        onLanePointer={onLanePointer}
        sim={minigame.sim}
      />
    )
  }

  return (
    <div className="testground-panel">
      <p className="testground-panel__eyebrow">{minigameId.replace('_', ' ')}</p>
      <p className="testground-panel__title">Minigame live</p>
      <p className="testground-panel__body">
        Use 1 / 2 / 3 to change lanes. N soft-drops in Block Cascade; runner uses
        the same lane keys.
      </p>
      <p className="testground-panel__meta">
        Resets: {minigame.sim.resetCount}
      </p>
    </div>
  )
}

function LaneDefenderCanvas({
  sim,
  onLanePointer,
}: {
  readonly sim: import('../../minigames/lane_defender/sim').LaneDefenderState
  readonly onLanePointer?: MinigameSurfaceProps['onLanePointer']
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<Partial<Record<string, HTMLImageElement>>>({})

  useEffect(() => {
    let cancelled = false
    void loadAssetBundle('lane_defender', {
      async load() {
        return laneDefenderManifest
      },
    }).then((bundle) => {
      if (cancelled) return
      for (const id of Object.keys(laneDefenderManifest.assets)) {
        const img = new Image()
        img.src = `/minigames/lane_defender/${bundle.resolve(id)}`
        imagesRef.current[id] = img
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const rect = canvas.getBoundingClientRect()
    const width = Math.max(1, Math.floor(rect.width))
    const height = Math.max(1, Math.floor(rect.height))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    const viewport = letterboxPlayfield(width, height)
    context.fillStyle = '#050508'
    context.fillRect(0, 0, width, height)
    context.fillStyle = '#121018'
    context.fillRect(viewport.x, viewport.y, viewport.width, viewport.height)

    const laneWidth = viewport.width / 3
    for (let lane = 0; lane < 3; lane++) {
      context.strokeStyle = '#2a2635'
      context.strokeRect(
        viewport.x + lane * laneWidth,
        viewport.y,
        laneWidth,
        viewport.height,
      )
    }

    for (const entity of sim.entities) {
      drawEntity(context, viewport, laneWidth, entity, imagesRef.current)
    }

    drawPlayer(context, viewport, laneWidth, sim.playerLane, imagesRef.current)
  }, [sim])

  return (
    <div className="testground-minigame-wrap">
      <div className="testground-minigame">
        <canvas
          aria-label="Minigame playfield"
          ref={canvasRef}
          onPointerDown={(event) => {
            const canvas = canvasRef.current
            if (!canvas || !onLanePointer) return
            const rect = canvas.getBoundingClientRect()
            const viewport = letterboxPlayfield(rect.width, rect.height)
            const x = event.clientX - rect.left - viewport.x
            if (x < 0 || x > viewport.width) return
            onLanePointer(x, viewport.width)
          }}
        />
      </div>
      <p className="testground-minigame__hint">1 · 2 · 3 lanes · auto-fire</p>
    </div>
  )
}

function drawPlayer(
  context: CanvasRenderingContext2D,
  viewport: ReturnType<typeof letterboxPlayfield>,
  laneWidth: number,
  lane: 'left' | 'center' | 'right',
  images: Partial<Record<string, HTMLImageElement>>,
) {
  const laneIndex = lane === 'left' ? 0 : lane === 'center' ? 1 : 2
  const x = viewport.x + laneIndex * laneWidth + laneWidth * 0.2
  const y = viewport.y + viewport.height * 0.78
  const w = laneWidth * 0.6
  const h = viewport.height * 0.12
  drawSprite(context, images.player, x, y, w, h, '#bdff45')
}

function drawEntity(
  context: CanvasRenderingContext2D,
  viewport: ReturnType<typeof letterboxPlayfield>,
  laneWidth: number,
  entity: LaneEntity,
  images: Partial<Record<string, HTMLImageElement>>,
) {
  const laneIndex =
    entity.lane === 'all'
      ? 1
      : entity.lane === 'left'
        ? 0
        : entity.lane === 'center'
          ? 1
          : 2
  const x = viewport.x + laneIndex * laneWidth + laneWidth * 0.22
  const y =
    viewport.y + viewport.height * Math.max(0.05, Math.min(0.72, entity.position))
  const w = laneWidth * 0.56
  const h = viewport.height * 0.08
  const assetId =
    entity.kind === 'NormalEnemy'
      ? 'enemy'
      : entity.kind === 'Boss'
        ? 'boss'
        : entity.kind === 'Barrier'
          ? 'barrier'
          : entity.kind === 'Mine'
            ? 'mine'
            : 'pickup'
  const tint =
    entity.kind === 'Pickup'
      ? '#6ecbff'
      : entity.kind === 'Boss'
        ? '#ff5577'
        : '#d0c8e8'
  drawSprite(context, images[assetId], x, y, w, h, tint)
}

function drawSprite(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  x: number,
  y: number,
  w: number,
  h: number,
  fallback: string,
) {
  if (image?.complete && image.naturalWidth > 0) {
    context.drawImage(image, x, y, w, h)
    return
  }
  context.fillStyle = fallback
  context.fillRect(x, y, w, h)
}

export function laneFromCanvasPointer(
  offsetX: number,
  playfieldWidth: number,
): ReturnType<typeof laneFromPointer> {
  return laneFromPointer(offsetX, playfieldWidth)
}
