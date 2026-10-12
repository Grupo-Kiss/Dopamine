import type { ActiveWindow } from '../core/focusChain'
import { focusChainFx, SCREEN_FX_INTENTS } from './focusChainFx'
import type { StickerEvent } from './stickers'

export function StickerHost({
  activeWindow,
  events,
  accessibilityMode = false,
}: {
  readonly activeWindow: ActiveWindow
  readonly events: readonly StickerEvent[]
  readonly accessibilityMode?: boolean
}) {
  return (
    <div
      aria-label="Arcade stickers"
      className="sticker-host"
      data-active-window={activeWindow}
      data-screen-fx={screenFx(events, accessibilityMode)}
      role="region"
    >
      {events.map((event) =>
        event.type === 'FocusChain' ? (
          <FocusChainSticker
            accessibilityMode={accessibilityMode}
            key={event.id}
            length={event.length}
          />
        ) : (
          <span className={`sticker sticker--${event.type}`} key={event.id}>
            {label(event)}
          </span>
        ),
      )}
    </div>
  )
}

function FocusChainSticker({
  length,
  accessibilityMode,
}: {
  readonly length: number
  readonly accessibilityMode: boolean
}) {
  const fx = focusChainFx(length, { accessibilityMode })

  return (
    <span
      className="sticker sticker--FocusChain"
      data-fx={fx.intents.join(' ')}
      data-fx-tier={fx.tier}
    >
      Focus Chain {length}
    </span>
  )
}

function screenFx(
  events: readonly StickerEvent[],
  accessibilityMode: boolean,
): string {
  const longest = Math.max(
    0,
    ...events.flatMap((event) =>
      event.type === 'FocusChain' ? [event.length] : [],
    ),
  )

  return focusChainFx(longest, { accessibilityMode })
    .intents.filter((intent) => SCREEN_FX_INTENTS.has(intent))
    .join(' ')
}

function label(event: Exclude<StickerEvent, { type: 'FocusChain' }>): string {
  if (event.type === 'Combo') return `x${event.multiplier}`
  if (event.type === 'BurnoutTelegraph') return 'Burnout incoming'
  return 'Recovery'
}
