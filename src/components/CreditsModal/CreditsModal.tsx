import { useEffect, useId, useRef } from 'react'
import { GAME_TITLE } from '../../config/tunables'
import { OsWindowChrome } from '../OsWindow/OsWindowChrome'
import '../OsWindow/OsWindow.css'
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
      <section
        className="os-window credits-modal__window"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <OsWindowChrome title={`${GAME_TITLE} — Credits`} />
        <div className="os-window__body credits-modal__body">
          <div className="credits-modal__toolbar">
            <h2 id={titleId} className="credits-modal__heading">
              Credits
            </h2>
            <button
              ref={closeRef}
              type="button"
              className="credits-modal__close"
              onClick={onClose}
            >
              Close
            </button>
          </div>
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
      </section>
    </div>
  )
}
