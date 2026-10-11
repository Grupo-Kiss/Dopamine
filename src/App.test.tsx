import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { App } from './App'

describe('app shell', () => {
  it('mounts a placeholder hub without requiring a Match', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: 'Dopamine hub' })).toBeVisible()
  })

  it('uses the core PLAY transition to enter Loading', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Play' }))

    expect(
      screen.getByRole('heading', { name: 'Loading Dopamine' }),
    ).toBeVisible()
  })
})
