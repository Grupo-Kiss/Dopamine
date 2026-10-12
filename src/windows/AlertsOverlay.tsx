import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Alert } from './alerts'

export type AlertsOverlayProps = {
  readonly alerts: readonly Alert[]
}

export function AlertsOverlay({ alerts }: AlertsOverlayProps) {
  const [root, setRoot] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    // The portal target is committed by the sibling Layout in the same render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoot(document.getElementById('alerts-root'))
  }, [])

  if (!root) return null

  return createPortal(
    <div className="alerts-overlay__cards">
      {alerts.map((alert) => (
        <div
          className={`alert-card alert-card--${alert.priority.toLowerCase()}`}
          key={alert.id}
          role="status"
        >
          <strong>{alert.priority}</strong>
          <span>{alert.message}</span>
        </div>
      ))}
    </div>,
    root,
  )
}
