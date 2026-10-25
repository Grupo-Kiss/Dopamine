import { useEffect, useState } from 'react'

import creditsStore from '../content/credits/store.json'
import echoManifest from '../content/echo/manifest.json'
import loopManifest from '../content/loop/manifest.json'
import waveManifest from '../content/wave/manifest.json'
import type { AudioMixer } from './audio/mixer'
import { DOPAMINE_MAX } from './config/balance'
import { GameOverView } from './components/GameOverView'
import { createDesktopLayout } from './components/layoutModel'
import { LoadingView } from './components/LoadingView'
import { PlayingView } from './components/PlayingView'
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
  play,
  playAgain,
  returnToHub,
  type GameOverState,
  type GameState,
  type LoadingState,
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

export function App({ audio = NO_AUDIO }: { readonly audio?: AudioMixer }) {
  const [state, setState] = useState<GameState>(() => boot())
  const [session, setSession] = useState<SessionValues | null>(null)

  useEffect(() => {
    if (state.phase === 'GameOver') void audio.silence()
  }, [audio, state.phase])

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
    setState(loadingComplete(loading))
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
        stats={{
          survivalTimeSeconds: 0,
          finalScore: 0,
          highestCombo: 0,
          longestFocusChain: 0,
          burnoutsTriggered: 0,
        }}
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
    <PlayingView
      audio={audio}
      dopamine={DOPAMINE_MAX}
      feel={{ mode: 'Playing', activeWindow: null }}
      model={layout}
      stickerEvents={[]}
    />
  )
}
