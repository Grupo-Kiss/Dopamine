import { useEffect, useRef } from 'react'

import type { AudioMixer } from '../audio/mixer'
import type { FeelAudioState } from '../audio/muffling'
import { ACCESSIBILITY_STORAGE_KEY } from './accessibility'
import { Layout, type LayoutProps } from './Layout'
import type { LayoutModel } from './layoutModel'
import { StickerHost } from './StickerHost'
import type { StickerEvent } from './stickers'

export type PlayingViewProps = {
  readonly audio: AudioMixer
  readonly model: LayoutModel
  readonly dopamine: number
  readonly feel: FeelAudioState
  readonly stickerEvents: readonly StickerEvent[]
  readonly accessibilityMode?: boolean
  readonly childrenByWindow?: LayoutProps['childrenByWindow']
  /**
   * Injected tick scheduler for tests. Defaults to requestAnimationFrame.
   * The callback fires once per frame; return a cancel function.
   */
  readonly scheduleTick?: (onTick: () => void) => () => void
}

export function PlayingView({
  audio,
  model,
  dopamine,
  feel,
  stickerEvents,
  accessibilityMode = readAccessibilityMode(),
  childrenByWindow,
  scheduleTick = rafScheduleTick,
}: PlayingViewProps) {
  const feelRef = useRef(feel)

  useEffect(() => {
    feelRef.current = feel
  }, [feel])

  useEffect(() => {
    return scheduleTick(() => {
      audio.applyFeelState(feelRef.current)
    })
  }, [audio, scheduleTick])

  const stickerWindow = feel.activeWindow ?? 'Minigame'

  return (
    <main aria-label="Playing">
      <Layout
        childrenByWindow={childrenByWindow}
        dopamine={dopamine}
        model={model}
      />
      <StickerHost
        accessibilityMode={accessibilityMode}
        activeWindow={stickerWindow}
        events={stickerEvents}
      />
    </main>
  )
}

function rafScheduleTick(onTick: () => void): () => void {
  let frame = 0
  const loop = () => {
    onTick()
    frame = requestAnimationFrame(loop)
  }
  frame = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(frame)
}

function readAccessibilityMode(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}
