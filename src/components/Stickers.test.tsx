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
      repeatedInteractions: 1,
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

  it('tags Focus Chain stickers with their FX tier and intents', () => {
    render(
      <StickerHost
        activeWindow="Loop"
        events={[
          { type: 'FocusChain', length: 2, id: 'chain-2' },
          { type: 'FocusChain', length: 12, id: 'chain-12' },
        ]}
      />,
    )

    const quiet = screen.getByText('Focus Chain 2')
    const loud = screen.getByText('Focus Chain 12')
    expect(quiet).toHaveAttribute('data-fx-tier', '0')
    expect(quiet).toHaveAttribute('data-fx', '')
    expect(loud).toHaveAttribute('data-fx-tier', '10')
    expect(loud).toHaveAttribute('data-fx', 'Popup Particles ScreenFlash')
    expect(
      screen.getByRole('region', { name: 'Arcade stickers' }),
    ).toHaveAttribute('data-screen-fx', 'ScreenFlash')
  })

  it('drops shake and flash from Focus Chain stickers in Accessibility Mode', () => {
    render(
      <StickerHost
        accessibilityMode
        activeWindow="Loop"
        events={[{ type: 'FocusChain', length: 16, id: 'chain-16' }]}
      />,
    )

    const sticker = screen.getByText('Focus Chain 16')
    expect(sticker).toHaveAttribute('data-fx-tier', '15')
    expect(sticker).toHaveAttribute('data-fx', 'Popup Particles ColorFade')
    expect(
      screen.getByRole('region', { name: 'Arcade stickers' }),
    ).toHaveAttribute('data-screen-fx', '')
  })

  it('renders Combo stickers juicy on a fresh window and flatter when farmed', () => {
    render(
      <StickerHost
        activeWindow="Pulse"
        events={[
          {
            type: 'Combo',
            multiplier: 1.2,
            repeatedInteractions: 1,
            id: 'fresh',
          },
          {
            type: 'Combo',
            multiplier: 2,
            repeatedInteractions: 60,
            id: 'farmed',
          },
        ]}
      />,
    )

    const fresh = screen.getByText('x1.2!!')
    const farmed = screen.getByText('x2')
    expect(Number(fresh.dataset.juiciness)).toBe(1)
    expect(Number(farmed.dataset.juiciness)).toBeLessThan(0.5)
    expect(fresh.style.getPropertyValue('--combo-scale')).toBe('1.35')
    expect(
      Number(farmed.style.getPropertyValue('--combo-scale')),
    ).toBeGreaterThanOrEqual(1)
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
