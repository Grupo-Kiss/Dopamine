import { useState } from 'react'

export const ACCESSIBILITY_STORAGE_KEY = 'dopamine.accessibilityMode'

export function useAccessibilityMode(
  storage: Storage = window.localStorage,
): readonly [boolean, (enabled: boolean) => void] {
  const [enabled, setEnabled] = useState(
    () => storage.getItem(ACCESSIBILITY_STORAGE_KEY) === 'true',
  )

  function update(nextEnabled: boolean): void {
    storage.setItem(ACCESSIBILITY_STORAGE_KEY, String(nextEnabled))
    setEnabled(nextEnabled)
  }

  return [enabled, update] as const
}
