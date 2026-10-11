import {
  handleFocusInteraction,
  type ActiveWindow,
  type FocusChain,
  type FocusDestinationState,
  type FocusInteractionResult,
} from './focusChain'

export type InputCommand =
  | { readonly type: 'Handled'; readonly [key: string]: unknown }
  | { readonly type: 'Repost' }
  | { readonly type: 'Like' }
  | { readonly type: 'Next' }
  | { readonly type: 'Reply' }
  | { readonly type: 'CreatePost' }
  | NavigationCommand

export type NavigationCommand = {
  readonly type: 'Navigate'
  readonly window: ActiveWindow
}

export type InputHandler = (code: string) => InputCommand | null

export type InputLayers = {
  readonly textInput?: InputHandler
  readonly activeAlert?: InputHandler
  readonly activeWindow?: InputHandler
}

export type RoutedInput = {
  readonly consumedBy:
    | 'TextInput'
    | 'Alert'
    | 'ActiveWindow'
    | 'Navigation'
    | null
  readonly command: InputCommand | null
}

export type InteractionSource = 'Keyboard' | 'Pointer' | 'Touch'

export type ValidWindowInteraction = {
  readonly source: InteractionSource
  readonly atMs: number
  readonly destination: ActiveWindow
  readonly destinationState: FocusDestinationState
}

const NAVIGATION: Readonly<Record<string, ActiveWindow>> = {
  KeyQ: 'Loop',
  KeyW: 'Pulse',
  KeyE: 'Wave',
  KeyY: 'Echo',
  KeyT: 'Minigame',
}

const WINDOW_ACTIONS: Readonly<Record<string, InputCommand>> = {
  KeyR: { type: 'Repost' },
  KeyL: { type: 'Like' },
  KeyN: { type: 'Next' },
  KeyC: { type: 'Reply' },
  KeyP: { type: 'CreatePost' },
}

export function routeInput(
  code: string,
  layers: InputLayers = {},
): RoutedInput {
  const prioritizedLayers = [
    ['TextInput', layers.textInput],
    ['Alert', layers.activeAlert],
    ['ActiveWindow', layers.activeWindow],
  ] as const

  for (const [consumedBy, handler] of prioritizedLayers) {
    const command = handler?.(code)
    if (command) {
      return { consumedBy, command }
    }
  }

  const windowAction = WINDOW_ACTIONS[code]
  if (windowAction) {
    return { consumedBy: 'ActiveWindow', command: windowAction }
  }

  const destination = NAVIGATION[code]
  if (destination) {
    return {
      consumedBy: 'Navigation',
      command: { type: 'Navigate', window: destination },
    }
  }

  return { consumedBy: null, command: null }
}

export function applyNavigation(
  chain: FocusChain,
  command: NavigationCommand,
  atMs: number,
  destinationState: FocusDestinationState,
): FocusInteractionResult {
  return applyValidWindowInteraction(chain, {
    source: 'Keyboard',
    atMs,
    destination: command.window,
    destinationState,
  })
}

export function applyValidWindowInteraction(
  chain: FocusChain,
  interaction: ValidWindowInteraction,
): FocusInteractionResult {
  return handleFocusInteraction(chain, {
    atMs: interaction.atMs,
    destination: interaction.destination,
    destinationState: interaction.destinationState,
    valid: true,
  })
}
