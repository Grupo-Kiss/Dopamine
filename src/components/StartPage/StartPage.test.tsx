import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GAME_TITLE } from '../../config/tunables'
import { StartPage } from './StartPage'

describe('StartPage', () => {
  it('shows the tunable game title, PLAY, Accessibility Mode, and Credits', () => {
    render(<StartPage onPlay={() => {}} />)

    expect(screen.getByRole('heading', { name: GAME_TITLE })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /accessibility mode/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /credits/i })).toBeInTheDocument()
  })

  it('calls onPlay when PLAY is pressed', async () => {
    const user = userEvent.setup()
    const onPlay = vi.fn()
    render(<StartPage onPlay={onPlay} />)

    await user.click(screen.getByRole('button', { name: /play/i }))
    expect(onPlay).toHaveBeenCalledTimes(1)
  })

  it('toggles Accessibility Mode and persists it', async () => {
    const user = userEvent.setup()
    localStorage.clear()
    render(<StartPage onPlay={() => {}} />)

    const toggle = screen.getByRole('switch', { name: /accessibility mode/i })
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(localStorage.getItem('dopamine.accessibilityMode')).toBe('1')
  })
})
