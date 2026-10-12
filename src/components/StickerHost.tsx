import type { CSSProperties } from 'react'

import type { ActiveWindow } from '../core/focusChain'
import { comboJuice, comboLabel } from './comboJuice'
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
        ) : event.type === 'Combo' ? (
          <ComboSticker
            accessibilityMode={accessibilityMode}
            key={event.id}
            multiplier={event.multiplier}
            repeatedInteractions={event.repeatedInteractions}
          />
        ) : (
          <span className={`sticker sticker--${event.type}`} key={event.id}>
            {event.type === 'BurnoutTelegraph'
              ? 'Burnout incoming'
              : 'Recovery'}
          </span>
        ),
      )}
    </div>
  )
}

function ComboSticker({
  multiplier,
  repeatedInteractions,
  accessibilityMode,
}: {
  readonly multiplier: number
  readonly repeatedInteractions: number
  readonly accessibilityMode: boolean
}) {
  const juice = comboJuice(repeatedInteractions, { accessibilityMode })
  const style = {
    '--combo-scale': cssNumber(juice.scale),
    '--combo-overshoot': cssNumber(juice.overshoot),
    '--combo-saturation': cssNumber(juice.saturation),
    '--combo-opacity': cssNumber(juice.opacity),
  } as CSSProperties

  return (
    <span
      className="sticker sticker--Combo"
      data-juiciness={cssNumber(juice.juiciness)}
      style={style}
    >
      {comboLabel(multiplier, juice)}
    </span>
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

function cssNumber(value: number): string {
  return String(Math.round(value * 1_000) / 1_000)
}
