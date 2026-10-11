import type { BurnoutMode } from '../core/burnout'

export type StickerEvent =
  | {
      readonly type: 'FocusChain'
      readonly length: number
      readonly id: string
    }
  | { readonly type: 'Combo'; readonly multiplier: number; readonly id: string }
  | { readonly type: 'BurnoutTelegraph'; readonly id: string }
  | { readonly type: 'Recovery'; readonly id: string }

export function stickerMotion(accessibilityMode: boolean) {
  return accessibilityMode
    ? { pop: false, shake: false, opacityOnly: true }
    : { pop: true, shake: true, opacityOnly: false }
}

export function burnoutStickerEvents(state: {
  readonly telegraphActive: boolean
  readonly mode: BurnoutMode
}): StickerEvent[] {
  const events: StickerEvent[] = []
  if (state.telegraphActive)
    events.push({ type: 'BurnoutTelegraph', id: 'burnout-telegraph' })
  if (state.mode === 'Recovery')
    events.push({ type: 'Recovery', id: 'recovery' })
  return events
}
