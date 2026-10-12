import type { MinigameId } from '../content/session'

export type MinigameController = {
  reset(): void
}

export type MinigameFactories = Readonly<
  Record<MinigameId, () => MinigameController>
>

export type MinigameCoreAction = {
  readonly source: 'Minigame'
  readonly minigameId: MinigameId
  readonly action: unknown
}

export type MinigameHost = {
  readonly minigameId: MinigameId
  reportValidAction(action: unknown): void
  reportFailure(): void
}

export function createMinigameHost(
  minigameId: MinigameId,
  factories: MinigameFactories,
  onValidAction: (action: MinigameCoreAction) => void,
): MinigameHost {
  const controller = factories[minigameId]()

  return {
    minigameId,
    reportValidAction(action) {
      onValidAction({
        source: 'Minigame',
        minigameId,
        action,
      })
    },
    reportFailure() {
      controller.reset()
    },
  }
}
