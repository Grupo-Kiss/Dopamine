import { createMinigameHost, type MinigameFactories } from './host'

describe('Minigame host', () => {
  it('mounts the selected session id and reports valid actions to core', () => {
    const reset = vi.fn()
    const factories: MinigameFactories = {
      lane_defender: vi.fn(() => ({ reset })),
      block_cascade: vi.fn(() => ({ reset: vi.fn() })),
      endless_runner: vi.fn(() => ({ reset: vi.fn() })),
    }
    const onValidAction = vi.fn()
    const host = createMinigameHost('lane_defender', factories, onValidAction)

    host.reportValidAction({ type: 'ChangeLane', lane: 'left' })

    expect(factories.lane_defender).toHaveBeenCalledOnce()
    expect(factories.block_cascade).not.toHaveBeenCalled()
    expect(onValidAction).toHaveBeenCalledWith({
      source: 'Minigame',
      minigameId: 'lane_defender',
      action: { type: 'ChangeLane', lane: 'left' },
    })
  })

  it('resets only local Minigame state on failure', () => {
    const reset = vi.fn()
    const resources = Object.freeze({
      dopamine: 48,
      score: 2_100,
      focusChain: 6,
      difficultyMultiplier: 1.4,
    })
    const factories: MinigameFactories = {
      lane_defender: () => ({ reset }),
      block_cascade: () => ({ reset: vi.fn() }),
      endless_runner: () => ({ reset: vi.fn() }),
    }
    const host = createMinigameHost('lane_defender', factories, vi.fn())

    host.reportFailure()

    expect(reset).toHaveBeenCalledOnce()
    expect(resources).toEqual({
      dopamine: 48,
      score: 2_100,
      focusChain: 6,
      difficultyMultiplier: 1.4,
    })
  })
})
