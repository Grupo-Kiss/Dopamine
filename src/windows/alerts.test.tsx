import { render, screen } from '@testing-library/react'

import { Layout } from '../components/Layout'
import { createDesktopLayout } from '../components/layoutModel'
import { createFocusChain } from '../core/focusChain'
import { routeInput } from '../core/input'
import {
  createAlertInputHandler,
  createAlerts,
  dismissActiveAlert,
  expireAlerts,
  openHighestPriorityAlert,
} from './alerts'
import { AlertsOverlay } from './AlertsOverlay'

const alerts = [
  {
    id: 'normal',
    message: 'A normal distraction',
    priority: 'Normal' as const,
    category: 'valuable' as const,
    reward: { dopamine: 2, score: 30 },
    destination: 'Pulse',
    expiresAtMs: 2_000,
  },
  {
    id: 'critical',
    message: 'Urgent fictional interruption',
    priority: 'Critical' as const,
    category: 'valuable' as const,
    reward: { dopamine: 5, score: 100 },
    destination: 'Echo',
    expiresAtMs: 1_000,
  },
]

describe('Alerts', () => {
  it('renders in the overlay root without changing masonry slots', () => {
    render(
      <>
        <Layout
          dopamine={100}
          model={createDesktopLayout({
            minigameSide: 'left',
            bottomOrder: ['Pulse', 'Echo'],
          })}
        />
        <AlertsOverlay alerts={alerts} />
      </>,
    )

    expect(screen.getAllByRole('article')).toHaveLength(5)
    expect(screen.getByText('Urgent fictional interruption')).toBeVisible()
    expect(
      screen.getByRole('region', { name: 'Alerts overlay' }),
    ).toContainElement(screen.getByText('A normal distraction'))
  })

  it('uses A for highest priority, Esc to dismiss, and wins input priority', () => {
    const state = createAlerts(alerts)
    const routed = routeInput('KeyR', {
      activeAlert: createAlertInputHandler(state),
      activeWindow: () => ({ type: 'Repost' }),
    })
    const opened = openHighestPriorityAlert(
      state,
      createFocusChain('Loop'),
      100,
    )

    expect(routed.consumedBy).toBe('Alert')
    expect(opened.state.activeAlert?.id).toBe('critical')
    expect(dismissActiveAlert(opened.state).activeAlert).toBeNull()
  })

  it('can extend Focus Chain on destination and forces spam reward to zero', () => {
    const opened = openHighestPriorityAlert(
      createAlerts(alerts),
      createFocusChain('Loop'),
      100,
    )
    expect(opened.focusChain.length).toBe(1)
    expect(opened.focusChain.activeWindow).toBe('Echo')

    const spam = openHighestPriorityAlert(
      createAlerts([
        {
          ...alerts[0]!,
          id: 'spam',
          category: 'spam',
          reward: { dopamine: 99, score: 99 },
        },
      ]),
      createFocusChain('Loop'),
      100,
    )
    expect(spam.reward).toEqual({ dopamine: 0, score: 0 })
  })

  it('dismisses and expires without direct Dopamine subtraction', () => {
    const state = createAlerts(alerts)
    const expired = expireAlerts(state, 2_000)
    const dismissed = dismissActiveAlert(
      openHighestPriorityAlert(state, createFocusChain('Loop'), 100).state,
    )

    expect(expired.pending).toHaveLength(0)
    expect(expired).not.toHaveProperty('dopaminePenalty')
    expect(dismissed).not.toHaveProperty('dopaminePenalty')
  })
})
