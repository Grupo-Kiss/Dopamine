import { createFakeMediaPort } from './media'

describe('media port fake', () => {
  it('records calls without loading network media', async () => {
    const media = createFakeMediaPort()

    await media.preload('loop-01', '/fixtures/loop-01.webm')
    await media.play('loop-01')
    media.pause('loop-01')
    media.stop('loop-01')

    expect(media.calls).toEqual([
      { operation: 'preload', id: 'loop-01', source: '/fixtures/loop-01.webm' },
      { operation: 'play', id: 'loop-01' },
      { operation: 'pause', id: 'loop-01' },
      { operation: 'stop', id: 'loop-01' },
    ])
  })
})
