import { useEffect, useRef } from 'react'

import type { CreditsStore } from './credits'

export type CreditsModalProps = {
  readonly credits: CreditsStore
  readonly onClose: () => void
}

export function CreditsModal({ credits, onClose }: CreditsModalProps) {
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButton.current?.focus()

    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="credits-backdrop">
      <section
        aria-label="Credits"
        aria-modal="true"
        className="credits-modal"
        role="dialog"
      >
        <header>
          <div>
            <p className="eyebrow">Legal &amp; attribution</p>
            <h2>Credits</h2>
          </div>
          <button
            aria-label="Close credits"
            onClick={onClose}
            ref={closeButton}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="credits-modal__scroll">
          <section>
            <h3>{credits.game.title}</h3>
            <p>{credits.game.blurb}</p>
            {credits.game.authors.length > 0 && (
              <p>{credits.game.authors.join(', ')}</p>
            )}
          </section>

          <section>
            <h3>Media, fonts &amp; libraries</h3>
            <ul className="credits-list">
              {credits.records.map((record) => (
                <li key={record.id}>
                  <strong>{record.title}</strong>
                  <span>
                    {record.creatorLabel} · {record.license}
                  </span>
                  {record.attribution && <span>{record.attribution}</span>}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Provider notice</h3>
            <p>{credits.providersNotice}</p>
          </section>

          <section>
            <h3>Disclaimer</h3>
            <p>{credits.disclaimer}</p>
          </section>
        </div>
      </section>
    </div>
  )
}
