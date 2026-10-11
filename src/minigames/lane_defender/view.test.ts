import type { AssetBundle } from '../assets'
import {
  createLaneDefenderView,
  laneFromKeyboard,
  laneFromPointer,
  letterboxPlayfield,
  startLaneDefenderLoop,
} from './view'

describe('Lane Defender canvas adapter', () => {
  it('letterboxes a 3:4 playfield instead of stretching', () => {
    expect(letterboxPlayfield(1_200, 600)).toEqual({
      x: 375,
      y: 0,
      width: 450,
      height: 600,
    })
    expect(letterboxPlayfield(300, 800)).toEqual({
      x: 0,
      y: 200,
      width: 300,
      height: 400,
    })
  })

  it('requests art by stable id without exposing sprite dimensions', () => {
    const requested: string[] = []
    const assets: AssetBundle = {
      gameId: 'lane_defender',
      skinId: 'fixture',
      resolve(id) {
        requested.push(id)
        return `/fixture/${id}.png`
      },
    }

    const view = createLaneDefenderView(assets, 1_200, 600)

    expect(view.viewport).toEqual({
      x: 375,
      y: 0,
      width: 450,
      height: 600,
    })
    expect(requested).toEqual(
      expect.arrayContaining([
        'player',
        'enemy',
        'boss',
        'barrier',
        'mine',
        'pickup',
        'ground',
        'backdrop',
      ]),
    )
    expect(view.sprites.player).toBe('/fixture/player.png')
  })

  it('maps 1/2/3 and pointer thirds to lanes', () => {
    expect(laneFromKeyboard('Digit1')).toBe('left')
    expect(laneFromKeyboard('Digit2')).toBe('center')
    expect(laneFromKeyboard('Digit3')).toBe('right')
    expect(laneFromPointer(10, 300)).toBe('left')
    expect(laneFromPointer(150, 300)).toBe('center')
    expect(laneFromPointer(299, 300)).toBe('right')
  })

  it('runs a thin injected RAF loop that forwards frame delta', () => {
    const frames: FrameRequestCallback[] = []
    const cancelled: number[] = []
    const raf = {
      request(callback: FrameRequestCallback) {
        frames.push(callback)
        return frames.length
      },
      cancel(id: number) {
        cancelled.push(id)
      },
    }
    const tick = vi.fn()
    const render = vi.fn()

    const stop = startLaneDefenderLoop(raf, tick, render)
    frames[0]!(100)
    frames[1]!(116)
    stop()

    expect(render).toHaveBeenCalledTimes(2)
    expect(tick).toHaveBeenCalledWith(16)
    expect(cancelled).toEqual([3])
  })
})
