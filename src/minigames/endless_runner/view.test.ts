import type { AssetBundle } from '../assets'
import {
  createEndlessRunnerView,
  runnerLaneFromKeyboard,
  runnerLaneFromSwipe,
} from './view'

describe('Endless Runner view', () => {
  it('resolves every texture through stable asset ids', () => {
    const requested: string[] = []
    const assets: AssetBundle = {
      gameId: 'endless_runner',
      skinId: 'fixture',
      resolve(id) {
        requested.push(id)
        return `fixture/${id}.png`
      },
    }
    const view = createEndlessRunnerView(assets)

    expect(requested).toEqual(
      expect.arrayContaining([
        'player',
        'obstacleStatic',
        'obstacleMoving',
        'collectible',
        'rareCollectible',
        'ground',
        'parallaxFar',
        'parallaxNear',
      ]),
    )
    expect(view.player).toBe('fixture/player.png')
  })

  it('maps 1/2/3 and swipe controls to lanes', () => {
    expect(runnerLaneFromKeyboard('Digit1')).toBe('left')
    expect(runnerLaneFromKeyboard('Digit2')).toBe('center')
    expect(runnerLaneFromKeyboard('Digit3')).toBe('right')
    expect(runnerLaneFromSwipe(-20, 'center')).toBe('left')
    expect(runnerLaneFromSwipe(20, 'center')).toBe('right')
  })
})
