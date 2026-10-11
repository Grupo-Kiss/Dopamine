import { render, screen } from '@testing-library/react'

import { Layout } from './Layout'
import { createDesktopLayout } from './layoutModel'

describe('Playing Layout', () => {
  it('renders Desktop slots, reserved Dopamine bar, and Alerts overlay root', () => {
    render(
      <Layout
        dopamine={72}
        model={createDesktopLayout({
          minigameSide: 'left',
          bottomOrder: ['Pulse', 'Echo'],
        })}
      />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(5)
    expect(screen.getByRole('article', { name: 'Minigame' })).toBeVisible()
    expect(screen.getByRole('article', { name: 'Loop' })).toBeVisible()
    expect(screen.getByRole('article', { name: 'Wave' })).toBeVisible()
    expect(screen.getByRole('article', { name: 'Pulse' })).toBeVisible()
    expect(screen.getByRole('article', { name: 'Echo' })).toBeVisible()
    expect(screen.getByRole('meter', { name: 'Dopamine' })).toHaveAttribute(
      'aria-valuenow',
      '72',
    )
    expect(
      screen.getByRole('region', { name: 'Alerts overlay' }),
    ).toBeInTheDocument()
  })
})
