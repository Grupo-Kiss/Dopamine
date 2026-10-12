export type MediaCall =
  | { operation: 'preload'; id: string; source: string }
  | { operation: 'play'; id: string }
  | { operation: 'pause'; id: string }
  | { operation: 'stop'; id: string }

export interface MediaPort {
  preload(id: string, source: string): Promise<void>
  play(id: string): Promise<void>
  pause(id: string): void
  stop(id: string): void
}

export interface FakeMediaPort extends MediaPort {
  readonly calls: MediaCall[]
}

export function createFakeMediaPort(): FakeMediaPort {
  const calls: MediaCall[] = []

  return {
    calls,
    async preload(id, source) {
      calls.push({ operation: 'preload', id, source })
    },
    async play(id) {
      calls.push({ operation: 'play', id })
    },
    pause(id) {
      calls.push({ operation: 'pause', id })
    },
    stop(id) {
      calls.push({ operation: 'stop', id })
    },
  }
}
