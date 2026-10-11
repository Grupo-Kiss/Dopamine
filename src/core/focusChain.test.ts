import {
  CHAIN_COMPLETION_DOPAMINE_PER_STEP,
  CHAIN_COMPLETION_SCORE_PER_STEP,
  FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS,
  FOCUS_CHAIN_TIMEOUT_BASE_MS,
  FOCUS_CHAIN_TIMEOUT_MIN_MS,
} from '../config/balance'
import {
  enterBurnout,
  enterRecovery,
  loadingComplete,
  play,
  boot,
} from './gameState'
import {
  breakFocusChain,
  createFocusChain,
  expireFocusChain,
  focusChainTimeoutMs,
  handleFocusInteraction,
  hoverWindow,
} from './focusChain'

describe('Focus Chain', () => {
  it.each(['Normal', 'FocusReady', 'AttentionRequest'] as const)(
    'extends on a valid Focus Change to %s',
    (destinationState) => {
      const initial = createFocusChain('Loop')
      const result = handleFocusInteraction(initial, {
        atMs: 100,
        destination: 'Pulse',
        destinationState,
        valid: true,
      })

      expect(result.chain.length).toBe(1)
      expect(result.chain.activeWindow).toBe('Pulse')
      expect(result.extended).toBe(true)
    },
  )

  it('does not extend into Waiting and breaks cooldown farming', () => {
    const first = handleFocusInteraction(createFocusChain('Loop'), {
      atMs: 100,
      destination: 'Pulse',
      destinationState: 'Normal',
      valid: true,
    }).chain
    const waiting = handleFocusInteraction(first, {
      atMs: 200,
      destination: 'Loop',
      destinationState: 'Waiting',
      valid: true,
    })

    expect(waiting.extended).toBe(false)
    expect(waiting.chain.length).toBe(0)
    expect(waiting.chain.activeWindow).toBe('Loop')
  })

  it('uses Focus Ready as quality rather than an eligibility gate', () => {
    const normal = handleFocusInteraction(createFocusChain('Loop'), {
      atMs: 100,
      destination: 'Pulse',
      destinationState: 'Normal',
      valid: true,
    })
    const ready = handleFocusInteraction(createFocusChain('Loop'), {
      atMs: 100,
      destination: 'Pulse',
      destinationState: 'FocusReady',
      valid: true,
    })
    const request = handleFocusInteraction(createFocusChain('Loop'), {
      atMs: 100,
      destination: 'Pulse',
      destinationState: 'AttentionRequest',
      valid: true,
    })
    const perfect = handleFocusInteraction(createFocusChain('Loop'), {
      atMs: 100,
      destination: 'Pulse',
      destinationState: 'AttentionRequest',
      timing: 'Tight',
      valid: true,
    })

    expect(normal).toMatchObject({ extended: true, quality: 'Poor' })
    expect(ready).toMatchObject({ extended: true, quality: 'Good' })
    expect(request).toMatchObject({ extended: true, quality: 'Excellent' })
    expect(perfect).toMatchObject({ extended: true, quality: 'Perfect' })
  })

  it('decays the continue-window to its configured floor', () => {
    expect(focusChainTimeoutMs(1)).toBe(FOCUS_CHAIN_TIMEOUT_BASE_MS)
    expect(focusChainTimeoutMs(2)).toBe(4_150)
    expect(focusChainTimeoutMs(3)).toBe(3_800)
    expect(focusChainTimeoutMs(10)).toBe(FOCUS_CHAIN_TIMEOUT_MIN_MS)
    expect(focusChainTimeoutMs(100)).toBe(FOCUS_CHAIN_TIMEOUT_MIN_MS)
  })

  it('expires deterministically against injected time', () => {
    const active = handleFocusInteraction(createFocusChain('Loop'), {
      atMs: 1_000,
      destination: 'Pulse',
      destinationState: 'Normal',
      valid: true,
    }).chain

    expect(expireFocusChain(active, 5_499).chain.length).toBe(1)
    expect(expireFocusChain(active, 5_500).chain.length).toBe(0)
  })

  it('pays completion once only at the configured minimum length', () => {
    const belowMinimum = buildChain(
      FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS - 1,
    )
    const eligible = buildChain(FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS)

    expect(breakFocusChain(belowMinimum.chain).completionBonus).toEqual({
      dopamine: 0,
      score: 0,
    })

    const ended = breakFocusChain(eligible.chain)
    expect(ended.completionBonus).toEqual({
      dopamine:
        FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS *
        CHAIN_COMPLETION_DOPAMINE_PER_STEP,
      score:
        FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS *
        CHAIN_COMPLETION_SCORE_PER_STEP,
    })
    expect(breakFocusChain(ended.chain).completionBonus).toEqual({
      dopamine: 0,
      score: 0,
    })
    expect(eligible.stepDopamineAwarded).toBeGreaterThan(0)
  })

  it('survives Burnout and Recovery because they modify Playing, not the chain', () => {
    const chain = buildChain(2).chain
    const playing = loadingComplete(play(boot()))

    enterRecovery(enterBurnout(playing))

    expect(chain.length).toBe(2)
  })

  it('ignores hover and invalid interactions for Active Window', () => {
    const initial = createFocusChain('Loop')
    const hovered = hoverWindow(initial, 'Pulse')
    const invalid = handleFocusInteraction(hovered, {
      atMs: 100,
      destination: 'Pulse',
      destinationState: 'Normal',
      valid: false,
    })

    expect(hovered).toBe(initial)
    expect(invalid.chain).toBe(initial)
    expect(invalid.chain.activeWindow).toBe('Loop')
  })
})

function buildChain(targetLength: number) {
  let chain = createFocusChain('Loop')
  let atMs = 0
  let stepDopamineAwarded = 0

  for (let length = 0; length < targetLength; length += 1) {
    atMs += 100
    const result = handleFocusInteraction(chain, {
      atMs,
      destination: length % 2 === 0 ? 'Pulse' : 'Loop',
      destinationState: 'Normal',
      valid: true,
    })
    chain = result.chain
    stepDopamineAwarded += result.stepBonus.dopamine
  }

  return { chain, stepDopamineAwarded }
}
