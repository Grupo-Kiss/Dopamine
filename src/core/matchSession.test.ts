import { recoveryProgress } from '../audio/muffling'
import { createFakeClock } from '../testing/clock'
import { DOPAMINE_DRAIN_PER_SECOND_BASE, DOPAMINE_MAX } from '../config/balance'
import {
  createMatchSession,
  matchAlertOpen,
  matchFocusNavigate,
  matchMinigameHit,
  projectMatchView,
  tickMatch,
} from './matchSession'

describe('Match session on the Playing shell', () => {
  it('starts full Dopamine with Playing feel and empty stickers', () => {
    const clock = createFakeClock(1_000)
    const session = createMatchSession(clock)
    const view = projectMatchView(session, clock)

    expect(session.dopamine.value).toBe(DOPAMINE_MAX)
    expect(session.depleted).toBe(false)
    expect(view.feel).toEqual({
      mode: 'Playing',
      activeWindow: null,
      recoveryProgress: undefined,
    })
    expect(view.stickerEvents).toEqual([])
  })

  it('drains Dopamine on tick using difficulty and signals depletion at 0', () => {
    const clock = createFakeClock(0)
    let session = createMatchSession(clock)

    clock.advance(10_000)
    let result = tickMatch(session, clock)
    session = result.session

    expect(session.dopamine.value).toBeCloseTo(
      DOPAMINE_MAX - DOPAMINE_DRAIN_PER_SECOND_BASE * 10,
      5,
    )
    expect(session.depleted).toBe(false)

    // Drain far past empty.
    clock.advance(1_000_000)
    result = tickMatch(session, clock)
    expect(result.session.dopamine.value).toBe(0)
    expect(result.session.depleted).toBe(true)
  })

  it('extends Focus Chain on window navigate, updates feel/stickers, and emits step cue', () => {
    const clock = createFakeClock(0)
    let session = createMatchSession(clock)

    const first = matchFocusNavigate(session, clock, 'Pulse')
    expect(first.cues).toEqual(['focusChainStep'])
    expect(first.session.focusChain).toMatchObject({
      activeWindow: 'Pulse',
      length: 1,
    })
    expect(first.feel.activeWindow).toBe('Pulse')
    expect(first.stickerEvents).toContainEqual({
      type: 'FocusChain',
      length: 1,
      id: 'focus-chain',
    })

    clock.advance(100)
    session = first.session
    const second = matchFocusNavigate(session, clock, 'Wave')
    expect(second.cues).toEqual(['focusChainStep'])
    expect(second.session.focusChain.length).toBe(2)
    expect(second.session.longestFocusChain).toBe(2)
    expect(second.session.dopamine.value).toBeGreaterThan(first.session.dopamine.value)
  })

  it('wires alert open and minigame hit to shell cue events', () => {
    const clock = createFakeClock(0)
    const session = createMatchSession(clock)

    expect(matchAlertOpen(session, clock).cues).toEqual(['alertOpen'])
    expect(matchMinigameHit(session, clock).cues).toEqual(['minigameHit'])
  })

  it('projects Recovery feel with recoveryProgress from burnout timing', () => {
    const clock = createFakeClock(0)
    const session = createMatchSession(clock)
    const recovering = {
      ...session,
      burnout: {
        ...session.burnout,
        mode: 'Recovery' as const,
        recoveryEndsAtMs: 8_000,
        dopamineDrainMultiplier: 1.5,
      },
    }

    clock.advance(2_000)
    const view = projectMatchView(recovering, clock)
    expect(view.feel.mode).toBe('Recovery')
    expect(view.feel.recoveryProgress).toBe(
      recoveryProgress(8_000, clock.now()),
    )
    expect(view.stickerEvents.map((event) => event.type)).toContain('Recovery')
  })
})
