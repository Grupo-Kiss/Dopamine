import { act, render, screen } from '@testing-library/react'

import { DOMAIN_CUE_IDS, type SfxCueManifest } from '../audio/cues'
import { createAudioMixer } from '../audio/mixer'
import { createFakeAudioPort } from '../testing/audio'
import { createDesktopLayout } from './layoutModel'
import {
  playShellCue,
  PlayingView,
  type ShellCueEvent,
} from './PlayingView'
import type { StickerEvent } from './stickers'

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

describe('Playing shell', () => {
  it('mounts Layout slots and StickerHost instead of a placeholder', () => {
    const events: StickerEvent[] = [
      { type: 'FocusChain', length: 3, id: 'chain-3' },
    ]
    const port = createFakeAudioPort()
    const audio = createAudioMixer(port, { manifest: FIXTURE_MANIFEST })

    render(
      <PlayingView
        audio={audio}
        dopamine={88}
        feel={{ mode: 'Playing', activeWindow: 'Pulse' }}
        model={DESKTOP}
        scheduleTick={() => () => {}}
        stickerEvents={events}
      />,
    )

    expect(screen.getByRole('main', { name: 'Playing' })).toBeVisible()
    expect(screen.queryByText('Match in progress')).toBeNull()
    expect(screen.getByRole('region', { name: 'Playing layout' })).toBeVisible()
    expect(screen.getByRole('article', { name: 'Minigame' })).toBeVisible()
    expect(screen.getByRole('meter', { name: 'Dopamine' })).toHaveAttribute(
      'aria-valuenow',
      '88',
    )
    expect(
      screen.getByRole('region', { name: 'Arcade stickers' }),
    ).toHaveTextContent('Focus Chain 3')
  })

  it('applies feel-state muffling on every tick', () => {
    const port = createFakeAudioPort()
    const audio = createAudioMixer(port, { manifest: FIXTURE_MANIFEST })
    let tick: (() => void) | undefined

    render(
      <PlayingView
        audio={audio}
        dopamine={100}
        feel={{
          mode: 'Recovery',
          activeWindow: 'Wave',
          recoveryProgress: 0.25,
        }}
        model={DESKTOP}
        scheduleTick={(onTick) => {
          tick = onTick
          return () => {
            tick = undefined
          }
        }}
        stickerEvents={[]}
      />,
    )

    expect(tick).toBeTypeOf('function')
    port.calls.length = 0

    act(() => {
      tick?.()
    })

    expect(
      port.calls.some(
        (call) => call.operation === 'setBusMuffle' && call.bus === 'wave',
      ),
    ).toBe(true)
    expect(
      port.calls.some(
        (call) => call.operation === 'setBusMuffle' && call.bus === 'pulse',
      ),
    ).toBe(true)
  })

  it('wires Focus Chain / alert / hit domain events to playCue ids', () => {
    const port = createFakeAudioPort()
    const audio = createAudioMixer(port, { manifest: FIXTURE_MANIFEST })
    const events: ShellCueEvent[] = [
      'focusChainStep',
      'alertOpen',
      'minigameHit',
    ]

    for (const event of events) {
      playShellCue(audio, event)
    }

    expect(port.calls.filter((call) => call.operation === 'playCue')).toEqual([
      { operation: 'playCue', id: DOMAIN_CUE_IDS.focusChainStep, bus: 'sfx' },
      { operation: 'playCue', id: DOMAIN_CUE_IDS.alertOpen, bus: 'sfx' },
      { operation: 'playCue', id: DOMAIN_CUE_IDS.minigameHit, bus: 'sfx' },
    ])
  })
})
