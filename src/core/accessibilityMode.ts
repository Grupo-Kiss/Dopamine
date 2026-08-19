import { ACCESSIBILITY_MODE_STORAGE_KEY } from '../config/tunables'

export function readAccessibilityMode(): boolean {
  try {
    return localStorage.getItem(ACCESSIBILITY_MODE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeAccessibilityMode(enabled: boolean): void {
  try {
    localStorage.setItem(ACCESSIBILITY_MODE_STORAGE_KEY, enabled ? '1' : '0')
  } catch {
    /* ignore quota / private mode */
  }
}
