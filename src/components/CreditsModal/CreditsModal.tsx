import { useEffect, useId, useRef } from 'react'
import { GAME_TITLE } from '../../config/tunables'
import './CreditsModal.css'

type CreditsModalProps = {
  onClose: () => void
}

export function CreditsModal({ onClose }: CreditsModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="credits-modal" role="presentation">
      <button
        type="button"
        className="credits-modal__backdrop"
        aria-label="Close credits"
        onClick={onClose}
      />
      <div
        className="credits-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="credits-modal__header">
          <h2 id={titleId}>{GAME_TITLE} — Credits</h2>
          <button
            ref={closeRef}
            type="button"
            className="credits-modal__close"
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <div className="credits-modal__body">
          <p>
            Frontend-only web arcade satire of the attention economy. Not affiliated
            with any real social or streaming platform.
          </p>
          <h3>Third-party media</h3>
          <p className="credits-modal__muted">
            Attribution list fills here as stock/API assets are added.
          </p>
          <h3>Fonts / libraries</h3>
          <ul>
            <li>Public Sans — UI</li>
            <li>Teko — PLAY lettering</li>
            <li>React, Vite, and other OSS — see package manifests</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
