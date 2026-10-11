import { WINDOW_REWARDS } from '../config/balance'
import { createFakeClock } from '../testing/clock'
import { createFakeMediaPort } from '../testing/media'
import { createEcho, echoAction, nextEchoItem, tickEcho } from './echo'

const items = [
  {
    id: 'echo-1',
    durationMs: 120_000,
    highlightAtMs: 30_000,
  },
  {
    id: 'echo-2',
    durationMs: 180_000,
    highlightAtMs: 90_000,
  },
]

describe('Echo window', () => {
  it('advances playback with injected time and N changes content', async () => {
    const clock = createFakeClock()
    const media = createFakeMediaPort()
    const initial = createEcho(items, clock)

    clock.advance(5_000)
    const playing = tickEcho(initial, clock)
    expect(playing.state.positionMs).toBe(5_000)

    const next = await nextEchoItem(playing.state, media, clock)
    expect(next.state.currentItem.id).toBe('echo-2')
    expect(next.reward).toEqual(WINDOW_REWARDS.Echo.ChangeContent)
  })

  it('rewards React and Subscribe with same-target diminishing', () => {
    const state = createEcho(items, createFakeClock())
    const reacted = echoAction(state, 'React')
    const reactedAgain = echoAction(reacted.state, 'React')
    const subscribed = echoAction(state, 'Subscribe')

    expect(reacted.reward).toEqual(WINDOW_REWARDS.Echo.React)
    expect(reactedAgain.reward.dopamine).toBeLessThan(reacted.reward.dopamine)
    expect(subscribed.reward).toEqual(WINDOW_REWARDS.Echo.Subscribe)
  })

  it('builds Anticipation toward a highlight and cashes out separately', () => {
    const clock = createFakeClock()
    const initial = createEcho(items, clock)
    clock.advance(10_000)
    const waiting = tickEcho(initial, clock)

    expect(waiting.state.anticipation).toMatchObject({
      kind: 'AnticipationBonus',
    })
    expect(waiting.state.anticipation.value).toBeGreaterThan(0)
    expect(waiting.state).not.toHaveProperty('discovery')

    clock.advance(20_000)
    const landed = tickEcho(waiting.state, clock)
    expect(landed.highlightLanded).toBe(true)
    expect(landed.reward.dopamine).toBeGreaterThan(
      WINDOW_REWARDS.Echo.HighlightedMoment.dopamine,
    )
    expect(landed.state.anticipation.value).toBe(0)
  })
})
