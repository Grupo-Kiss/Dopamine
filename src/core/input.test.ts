import { createFocusChain } from './focusChain'
import {
  applyNavigation,
  applyValidWindowInteraction,
  routeInput,
  type InputHandler,
} from './input'

describe('input router', () => {
  it('routes text before Alert, Active Window, and navigation', () => {
    const calls: string[] = []
    const handler =
      (layer: string): InputHandler =>
      (code) => {
        calls.push(layer)
        return { type: 'Handled', layer, code }
      }

    const result = routeInput('KeyY', {
      textInput: handler('text'),
      activeAlert: handler('alert'),
      activeWindow: handler('window'),
    })

    expect(result).toEqual({
      consumedBy: 'TextInput',
      command: { type: 'Handled', layer: 'text', code: 'KeyY' },
    })
    expect(calls).toEqual(['text'])
  })

  it('falls through layers in priority order when they do not claim a key', () => {
    const calls: string[] = []
    const pass =
      (layer: string): InputHandler =>
      () => {
        calls.push(layer)
        return null
      }

    expect(
      routeInput('KeyY', {
        textInput: pass('text'),
        activeAlert: pass('alert'),
        activeWindow: pass('window'),
      }),
    ).toEqual({
      consumedBy: 'Navigation',
      command: { type: 'Navigate', window: 'Echo' },
    })
    expect(calls).toEqual(['text', 'alert', 'window'])
  })

  it('keeps R as Repost and Y as Echo navigation', () => {
    expect(routeInput('KeyR')).toEqual({
      consumedBy: 'ActiveWindow',
      command: { type: 'Repost' },
    })
    expect(routeInput('KeyY')).toEqual({
      consumedBy: 'Navigation',
      command: { type: 'Navigate', window: 'Echo' },
    })
  })

  it('routes navigation through the normal valid Focus Change path', () => {
    const start = createFocusChain('Minigame')
    const toLoop = routeInput('KeyQ')
    if (toLoop.command?.type !== 'Navigate') {
      throw new Error('Expected a navigation command')
    }

    const result = applyNavigation(start, toLoop.command, 100, 'Normal')

    expect(result.chain.activeWindow).toBe('Loop')
    expect(result.chain.length).toBe(1)
  })

  it.each(['Keyboard', 'Pointer', 'Touch'] as const)(
    'uses the same valid-interaction helper for %s',
    (source) => {
      const result = applyValidWindowInteraction(createFocusChain('Loop'), {
        source,
        atMs: 100,
        destination: 'Pulse',
        destinationState: 'Normal',
      })

      expect(result.chain).toMatchObject({
        activeWindow: 'Pulse',
        length: 1,
      })
    },
  )
})
