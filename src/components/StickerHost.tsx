import type { ActiveWindow } from '../core/focusChain'
import type { StickerEvent } from './stickers'

export function StickerHost({
  activeWindow,
  events,
}: {
  readonly activeWindow: ActiveWindow
  readonly events: readonly StickerEvent[]
}) {
  return (
    <div
      aria-label="Arcade stickers"
      className="sticker-host"
      data-active-window={activeWindow}
      role="region"
    >
      {events.map((event) => (
        <span className={`sticker sticker--${event.type}`} key={event.id}>
          {label(event)}
        </span>
      ))}
    </div>
  )
}

function label(event: StickerEvent): string {
  if (event.type === 'FocusChain') return `Focus Chain ${event.length}`
  if (event.type === 'Combo') return `x${event.multiplier}`
  if (event.type === 'BurnoutTelegraph') return 'Burnout incoming'
  return 'Recovery'
}
