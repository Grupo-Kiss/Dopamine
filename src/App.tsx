import { useState } from 'react'

import creditsStore from '../content/credits/store.json'
import echoManifest from '../content/echo/manifest.json'
import loopManifest from '../content/loop/manifest.json'
import waveManifest from '../content/wave/manifest.json'
import type { AudioMixer } from './audio/mixer'
import { GameOverView } from './components/GameOverView'
import { createDesktopLayout } from './components/layoutModel'
import { LoadingView } from './components/LoadingView'
import {
  MatchPlaying,
  type MatchEndStats,
} from './components/MatchPlaying'
import { StartPage } from './components/StartPage'
import {
  evaluatePreloadGate,
  type ContentPack,
} from './content/preloadGate'
import {
  createSessionValues,
  type SessionValues,
} from './content/session'
import {
  boot,
  loadingComplete,
  loadingFailed,
  notifyDopamineDepleted,
  play,
  playAgain,
  returnToHub,
  type GameOverState,
  type GameState,
  type LoadingState,
  type PlayingState,
  type StartPageState,
} from './core/gameState'
import { createSeededRng } from './testing/rng'
import './styles.css'

const NO_AUDIO: AudioMixer = {
  async unlock() {},
  setBusGain() {},
  setBusMuffled() {},
  applyFeelState() {},
  playCue() {},
  async silence() {},
}

const STARTER_PACK: ContentPack = {
  loop: { clips: loopManifest.clips },
  wave: { tracks: waveManifest.tracks },
  echo: { items: echoManifest.items },
}

const EMPTY_STATS: MatchEndStats = {
  survivalTimeSeconds: 0,
  finalScore: 0,
  highestCombo: 0,
  longestFocusChain: 0,
  burnoutsTriggered: 0,
}

export function App({ audio = NO_AUDIO }: { readonly audio?: AudioMixer }) {
  const [state, setState] = useState<GameState>(() => boot())
  const [session, setSession] = useState<SessionValues | null>(null)
  const [matchStats, setMatchStats] = useState<MatchEndStats>(EMPTY_STATS)

  function startFromHub(hub: StartPageState): void {
    void audio.unlock()
    finishLoading(play(hub))
  }

  function startFromGameOver(gameOver: GameOverState): void {
    finishLoading(playAgain(gameOver))
  }

  function finishLoading(loading: LoadingState): void {
    const result = evaluatePreloadGate(STARTER_PACK)
    if (!result.ok) {
      setState(loadingFailed(loading, result.errors.join('; ')))
      return
    }

    setSession(createSessionValues(createSeededRng(Date.now() >>> 0)))
    setMatchStats(EMPTY_STATS)
    setState(loadingComplete(loading))
  }

  function endMatch(playing: PlayingState, stats: MatchEndStats): void {
    setMatchStats(stats)
    void audio.silence()
    setState(notifyDopamineDepleted(playing))
  }

  if (state.phase === 'StartPage') {
    return (
      <StartPage
        credits={creditsStore}
        onPlay={() => startFromHub(state)}
      />
    )
  }

  if (state.phase === 'Loading') {
    return <LoadingView error={state.error} />
  }

  if (state.phase === 'GameOver') {
    return (
      <GameOverView
        credits={creditsStore}
        onPlayAgain={() => startFromGameOver(state)}
        onReturnToHub={() => setState(returnToHub(state))}
        stats={matchStats}
      />
    )
  }

  const layout = createDesktopLayout(
    session?.desktopLayout ?? {
      minigameSide: 'left',
      bottomOrder: ['Pulse', 'Echo'],
    },
  )

  return (
    <MatchPlaying
      audio={audio}
      model={layout}
      onDepleted={(stats) => endMatch(state, stats)}
    />
  )
}
