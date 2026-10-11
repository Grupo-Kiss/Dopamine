import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import creditsStore from '../../content/credits/store.json'
import { GameOverView } from './GameOverView'
import { LoadingView } from './LoadingView'
import { StartPage } from './StartPage'

describe('hub surfaces', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows Start Page instructions and controls without ticking a Match', async () => {
    const user = userEvent.setup()
    const onPlay = vi.fn()

    render(<StartPage credits={creditsStore} onPlay={onPlay} />)

    expect(
      screen.getByRole('heading', { name: 'Dopamine' }),
    ).toBeVisible()
    expect(screen.getByText(/switch windows/i)).toBeVisible()
    expect(
      screen.getByRole('checkbox', { name: 'Accessibility Mode' }),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Credits' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(onPlay).toHaveBeenCalledOnce()
  })

  it('persists Accessibility Mode and restores it on remount', async () => {
    const user = userEvent.setup()
    const first = render(
      <StartPage credits={creditsStore} onPlay={vi.fn()} />,
    )
    const toggle = screen.getByRole('checkbox', {
      name: 'Accessibility Mode',
    })

    await user.click(toggle)
    expect(localStorage.getItem('dopamine.accessibilityMode')).toBe('true')

    first.unmount()
    render(<StartPage credits={creditsStore} onPlay={vi.fn()} />)
    expect(
      screen.getByRole('checkbox', { name: 'Accessibility Mode' }),
    ).toBeChecked()
  })

  it('opens a scrollable Credits Modal from the store and returns to hub', async () => {
    const user = userEvent.setup()
    render(<StartPage credits={creditsStore} onPlay={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Credits' }))
    expect(screen.getByRole('dialog', { name: 'Credits' })).toBeVisible()
    expect(screen.getByText('Public Sans')).toBeVisible()
    expect(screen.getByText(/not affiliated/i)).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Close credits' }))
    expect(screen.queryByRole('dialog', { name: 'Credits' })).toBeNull()
    expect(screen.getByRole('main', { name: 'Dopamine hub' })).toBeVisible()
  })

  it('keeps Loading visible and exposes validation errors', () => {
    const { rerender } = render(<LoadingView />)

    expect(
      screen.getByRole('heading', { name: 'Loading Dopamine' }),
    ).toBeVisible()
    rerender(<LoadingView error="Starter pack is incomplete" />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Starter pack is incomplete',
    )
  })

  it('shows Game Over stats and both exit paths', async () => {
    const user = userEvent.setup()
    const onPlayAgain = vi.fn()
    const onReturnToHub = vi.fn()

    render(
      <GameOverView
        credits={creditsStore}
        onPlayAgain={onPlayAgain}
        onReturnToHub={onReturnToHub}
        stats={{
          survivalTimeSeconds: 123,
          finalScore: 4_500,
          highestCombo: 8,
          longestFocusChain: 11,
          burnoutsTriggered: 2,
        }}
      />,
    )

    expect(screen.getByText('Survival Time')).toBeVisible()
    expect(screen.getByText('Final Score')).toBeVisible()
    expect(screen.getByText('Highest Combo')).toBeVisible()
    expect(screen.getByText('Longest Focus Chain')).toBeVisible()
    expect(screen.getByText('Burnouts Triggered')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Credits' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Play Again' }))
    await user.click(screen.getByRole('button', { name: 'Return to hub' }))
    expect(onPlayAgain).toHaveBeenCalledOnce()
    expect(onReturnToHub).toHaveBeenCalledOnce()
  })
})
