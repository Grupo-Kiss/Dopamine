import postsStore from '../../content/pulse/posts.json'
import { WINDOW_REWARDS } from '../config/balance'
import {
  createPulse,
  pulseEventIntervalMs,
  pulseShortcut,
  publishPulseText,
  raisePulseAttention,
  respondToPulseAttention,
  tickPulse,
} from './pulse'

describe('Pulse window', () => {
  it('loads a non-empty Normal timeline from the content pack', () => {
    const pulse = createPulse(postsStore.posts)

    expect(pulse.windowState).toBe('Normal')
    expect(pulse.timeline.length).toBeGreaterThan(0)
  })

  it('supports Like, Repost, Reply, and Create Post shortcut paths', () => {
    const initial = createPulse(postsStore.posts)
    const postId = initial.timeline[0]!.id

    expect(pulseShortcut(initial, 'KeyL', postId).reward).toEqual(
      WINDOW_REWARDS.Pulse.Like,
    )
    expect(pulseShortcut(initial, 'KeyR', postId).reward).toEqual(
      WINDOW_REWARDS.Pulse.Repost,
    )

    const replying = pulseShortcut(initial, 'KeyC', postId).state
    expect(replying.composer).toEqual({ mode: 'Reply', postId, text: '' })
    expect(
      publishPulseText(replying, 'the trend agrees', true).reward,
    ).toEqual(WINDOW_REWARDS.Pulse.ReplyOnTrend)

    const creating = pulseShortcut(initial, 'KeyP', postId).state
    expect(creating.composer).toEqual({
      mode: 'CreatePost',
      postId: null,
      text: '',
    })
    expect(
      publishPulseText(creating, 'a perfectly optimized take', true).reward,
    ).toEqual(WINDOW_REWARDS.Pulse.CreatePostOnTrend)
  })

  it('raises expiring mention/trend Attention Requests without penalties', () => {
    const request = raisePulseAttention(
      createPulse(postsStore.posts),
      'Mention',
      1_000,
    )

    expect(request.attentionRequest?.kind).toBe('Mention')
    expect(respondToPulseAttention(request, 999).reward).toEqual(
      WINDOW_REWARDS.Pulse.Mention,
    )

    const expired = tickPulse(request, 1_000)
    expect(expired.attentionRequest).toBeNull()
    expect(expired).not.toHaveProperty('dopaminePenalty')
    expect(pulseEventIntervalMs(0.5)).toBeLessThan(pulseEventIntervalMs(1))
  })

  it('grants zero Dopamine and Score for marked advertising or spam', () => {
    const pulse = createPulse(postsStore.posts)
    const noise = pulse.timeline.find((post) => !post.rewardable)
    if (!noise) throw new Error('Expected noise fixture')

    expect(pulseShortcut(pulse, 'KeyL', noise.id).reward).toEqual({
      dopamine: 0,
      score: 0,
    })
    expect(pulseShortcut(pulse, 'KeyR', noise.id).reward).toEqual({
      dopamine: 0,
      score: 0,
    })
  })
})
