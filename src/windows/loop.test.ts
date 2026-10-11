import { WINDOW_REWARDS } from '../config/balance'
import { createFakeMediaPort } from '../testing/media'
import {
  createLoop,
  createLoopOpportunity,
  handleLoopMediaEnded,
  leaveLoop,
  loopAction,
  nextLoopClip,
  respondToLoopOpportunity,
  tickLoop,
} from './loop'

const clips = [
  { id: 'loop-1', source: '/loop-1.webm' },
  { id: 'loop-2', source: '/loop-2.webm' },
]

describe('Loop window', () => {
  it('loops the current clip on media end until the player chooses Next', async () => {
    const media = createFakeMediaPort()
    const initial = createLoop(clips)

    expect(handleLoopMediaEnded(initial)).toBe(initial)
    expect(initial.currentClip.id).toBe('loop-1')
    expect(media.calls).toEqual([])

    const next = await nextLoopClip(initial, media)
    expect(next.state.currentClip.id).toBe('loop-2')
    expect(media.calls).toContainEqual({
      operation: 'play',
      id: 'loop-2',
    })
  })

  it('grants Like and Repost rewards with same-target diminishing', () => {
    const initial = createLoop(clips)
    const liked = loopAction(initial, 'Like')
    const likedAgain = loopAction(liked.state, 'Like')
    const reposted = loopAction(initial, 'Repost')

    expect(liked.reward).toEqual(WINDOW_REWARDS.Loop.Like)
    expect(likedAgain.reward.dopamine).toBeLessThan(liked.reward.dopamine)
    expect(reposted.reward).toEqual(WINDOW_REWARDS.Loop.Repost)
  })

  it('lets an Attention Request expire without a Dopamine penalty', () => {
    const opportunity = createLoopOpportunity(createLoop(clips), 1_000)
    const expired = tickLoop(opportunity, 1_000)

    expect(expired.opportunity).toBeNull()
    expect(expired).not.toHaveProperty('dopaminePenalty')
    expect(respondToLoopOpportunity(opportunity, 999).reward).toEqual(
      WINDOW_REWARDS.Loop.InteractiveOpportunity,
    )
  })

  it('moves from Waiting to Focus Ready only after leave cooldown', () => {
    const waiting = leaveLoop(createLoop(clips), 100)

    expect(waiting.windowState).toBe('Waiting')
    expect(tickLoop(waiting, 2_599).windowState).toBe('Waiting')
    expect(tickLoop(waiting, 2_600).windowState).toBe('FocusReady')
  })
})
