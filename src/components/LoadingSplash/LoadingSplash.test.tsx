import { render, screen, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { GAME_TITLE } from '../../config/tunables'
import { LoadingSplash } from './LoadingSplash'

describe('LoadingSplash', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('shows the game title and a loading status', () => {
    render(<LoadingSplash onReady={() => {}} />)

    expect(screen.getByText(GAME_TITLE)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows window icons for the five services', () => {
    render(<LoadingSplash onReady={() => {}} />)

    for (const label of ['Loop', 'Pulse', 'Wave', 'Echo', 'Alerts']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('calls onReady after the simulated preload completes', () => {
    const onReady = vi.fn()
    render(<LoadingSplash onReady={onReady} />)

    expect(onReady).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3200)
    })

    expect(onReady).toHaveBeenCalledTimes(1)
  })
})
