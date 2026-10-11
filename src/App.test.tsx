import { render, screen } from '@testing-library/react'

import { App } from './App'

describe('app shell', () => {
  it('mounts a placeholder hub without requiring a Match', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: 'Dopamine hub' })).toBeVisible()
  })
})
