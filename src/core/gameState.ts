export type StartPageState = {
  readonly phase: 'StartPage'
  readonly matchClockRunning: false
}

export type LoadingState = {
  readonly phase: 'Loading'
  readonly matchClockRunning: false
  readonly error?: string
}

type PlayingBase = {
  readonly phase: 'Playing'
  readonly matchClockRunning: true
  readonly systemsStopped: false
}

export type NormalPlayingState = PlayingBase & {
  readonly modifier: 'Normal'
}

export type BurnoutPlayingState = PlayingBase & {
  readonly modifier: 'Burnout'
}

export type RecoveryPlayingState = PlayingBase & {
  readonly modifier: 'Recovery'
}

export type PlayingState =
  NormalPlayingState | BurnoutPlayingState | RecoveryPlayingState

export type GameOverState = {
  readonly phase: 'GameOver'
  readonly matchClockRunning: false
  readonly systemsStopped: true
}

export type GameState =
  StartPageState | LoadingState | PlayingState | GameOverState

export function boot(): StartPageState {
  return {
    phase: 'StartPage',
    matchClockRunning: false,
  }
}

export function play(_state: StartPageState): LoadingState {
  return createLoadingState()
}

export function loadingComplete(_state: LoadingState): NormalPlayingState {
  return createPlayingState('Normal')
}

export function loadingFailed(
  _state: LoadingState,
  reason: string,
): LoadingState {
  return {
    ...createLoadingState(),
    error: reason,
  }
}

export function notifyDopamineDepleted(_state: PlayingState): GameOverState {
  return {
    phase: 'GameOver',
    matchClockRunning: false,
    systemsStopped: true,
  }
}

export function playAgain(_state: GameOverState): LoadingState {
  return createLoadingState()
}

export function returnToHub(_state: GameOverState): StartPageState {
  return boot()
}

export function enterBurnout(_state: NormalPlayingState): BurnoutPlayingState {
  return createPlayingState('Burnout')
}

export function enterRecovery(
  _state: BurnoutPlayingState,
): RecoveryPlayingState {
  return createPlayingState('Recovery')
}

export function exitRecovery(_state: RecoveryPlayingState): NormalPlayingState {
  return createPlayingState('Normal')
}

function createLoadingState(): LoadingState {
  return {
    phase: 'Loading',
    matchClockRunning: false,
  }
}

function createPlayingState(modifier: 'Normal'): NormalPlayingState
function createPlayingState(modifier: 'Burnout'): BurnoutPlayingState
function createPlayingState(modifier: 'Recovery'): RecoveryPlayingState
function createPlayingState(modifier: PlayingState['modifier']): PlayingState {
  return {
    phase: 'Playing',
    modifier,
    matchClockRunning: true,
    systemsStopped: false,
  }
}
