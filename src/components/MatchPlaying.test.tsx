import { act, fireEvent, render, screen } from '@testing-library/react'

import { DOMAIN_CUE_IDS, type SfxCueManifest } from '../audio/cues'
import { createAudioMixer } from '../audio/mixer'
import { createFakeAudioPort } from '../testing/audio'
import { createFakeClock } from '../testing/clock'
import { createDesktopLayout } from './layoutModel'
import { MatchPlaying } from './MatchPlaying'

const FIXTURE_MANIFEST: SfxCueManifest = {
  version: 1,
  cues: [
    {
      id: 'sfx_chain_step',
      path: 'content/minigames/_shared/sfx_sticker_chain_step.ogg',
      bus: 'bus_reward',
      status: 'final',
      license: 'owned',
      attribution: '',
    },
    {
      id: 'sfx_alert_normal',
      path: 'content/sfx/alerts/normal.ogg',
      bus: 'bus_alert',
      status: 'final',
      license: 'owned',
      attribution: '',
    },
    {
      id: 'sfx_ld_hit',
      path: 'content/minigames/lane_defender/sfx_hit.ogg',
      bus: 'bus_minigame',
      status: 'final',
      license: 'owned',
      attribution: '',
    },
  ],
}

const DESKTOP = createDesktopLayout({
  minigameSide: 'left',
  bottomOrder: ['Pulse', 'Echo'],
})

describe('MatchPlaying on the shell', () => {
  it('ticks Match systems into PlayingView Dopamine / feel / stickers', () => {
    const clock = createFakeClock(0)
    const port = createFakeAudioPort()
    const audio = createAudioMixer(port, { manifest: FIXTURE_MANIFEST })
    let tick: (() => void) | undefined

    render(
      <MatchPlaying
        audio={audio}
        clock={clock}
        model={DESKTOP}
        onDepleted={vi.fn()}
        scheduleTick={(onTick) => {
          tick = onTick
          return () => {
            tick = undefined
          }
        }}
      />,
    )

    expect(screen.getByRole('main', { name: 'Playing' })).toBeVisible()
    expect(screen.getByRole('meter', { name: 'Dopamine' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    )

    clock.advance(2_000)
    act(() => {
      tick?.()
    })

    const meter = screen.getByRole('meter', { name: 'Dopamine' })
    expect(Number(meter.getAttribute('aria-valuenow'))).toBeLessThan(100)
    expect(
      port.calls.some((call) => call.operation === 'setBusMuffle'),
    ).toBe(true)
  })

  it('plays Focus Chain cue on keyboard window navigate', () => {
    const clock = createFakeClock(0)
    const port = createFakeAudioPort()
    const audio = createAudioMixer(port, { manifest: FIXTURE_MANIFEST })

    render(
      <MatchPlaying
        audio={audio}
        clock={clock}
        model={DESKTOP}
        onDepleted={vi.fn()}
        scheduleTick={() => () => {}}
      />,
    )

    act(() => {
      fireEvent.keyDown(window, { code: 'KeyW', key: 'w' })
    })

    expect(
      port.calls.filter((call) => call.operation === 'playCue'),
    ).toContainEqual({
      operation: 'playCue',
      id: DOMAIN_CUE_IDS.focusChainStep,
      bus: 'sfx',
    })
    expect(
      screen.getByRole('region', { name: 'Arcade stickers' }),
    ).toHaveTextContent('Focus Chain 1')
  })

  it('notifies when Dopamine depletes', () => {
    const clock = createFakeClock(0)
    const port = createFakeAudioPort()
    const audio = createAudioMixer(port, { manifest: FIXTURE_MANIFEST })
    const onDepleted = vi.fn()
    let tick: (() => void) | undefined

    render(
      <MatchPlaying
        audio={audio}
        clock={clock}
        model={DESKTOP}
        onDepleted={onDepleted}
        scheduleTick={(onTick) => {
          tick = onTick
          return () => {
            tick = undefined
          }
        }}
      />,
    )

    clock.advance(1_000_000)
    act(() => {
      tick?.()
    })

    expect(onDepleted).toHaveBeenCalledOnce()
  })
})
