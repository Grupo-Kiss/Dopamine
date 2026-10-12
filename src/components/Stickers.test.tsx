import { render, screen } from '@testing-library/react'

import {
  burnoutStickerEvents,
  stickerMotion,
  type StickerEvent,
} from './stickers'
import { StickerHost } from './StickerHost'

describe('baseline stickers', () => {
  it('renders Focus Chain steps in an overlay host', () => {
    const events: StickerEvent[] = [
      { type: 'FocusChain', length: 4, id: 'chain-4' },
    ]
    render(<StickerHost activeWindow="Pulse" events={events} />)

    expect(
      screen.getByRole('region', { name: 'Arcade stickers' }),
    ).toHaveTextContent('Focus Chain 4')
  })

  it('keeps Combo and Focus Chain distinct in the event API', () => {
    const combo: StickerEvent = {
      type: 'Combo',
      multiplier: 2.5,
      id: 'combo',
    }
    const chain: StickerEvent = {
      type: 'FocusChain',
      length: 7,
      id: 'chain',
    }

    expect(combo.type).toBe('Combo')
    expect(chain.type).toBe('FocusChain')
    expect(combo).not.toHaveProperty('length')
    expect(chain).not.toHaveProperty('multiplier')
  })

  it('uses opacity-only motion in Accessibility Mode', () => {
    expect(stickerMotion(false)).toEqual({
      pop: true,
      shake: true,
      opacityOnly: false,
    })
    expect(stickerMotion(true)).toEqual({
      pop: false,
      shake: false,
      opacityOnly: true,
    })
  })

  it('surfaces Burnout telegraph and Recovery as short-lived stickers', () => {
    expect(
      burnoutStickerEvents({
        telegraphActive: true,
        mode: 'Playing',
      }).map((event) => event.type),
    ).toContain('BurnoutTelegraph')
    expect(
      burnoutStickerEvents({
        telegraphActive: false,
        mode: 'Recovery',
      }).map((event) => event.type),
    ).toContain('Recovery')
  })
})
