import { useEffect, useState } from 'react'

import creditsStore from '../content/credits/store.json'
import type { AudioMixer } from './audio/mixer'
import { GameOverView } from './components/GameOverView'
import { LoadingView } from './components/LoadingView'
import { StartPage } from './components/StartPage'
import {
  boot,
  play,
  playAgain,
  returnToHub,
  type GameState,
} from './core/gameState'
import './styles.css'

const NO_AUDIO: AudioMixer = {
  async unlock() {},
  setBusGain() {},
  setBusMuffled() {},
  async silence() {},
}

export function App({ audio = NO_AUDIO }: { readonly audio?: AudioMixer }) {
  const [state, setState] = useState<GameState>(() => boot())

  useEffect(() => {
    if (state.phase === 'GameOver') void audio.silence()
  }, [audio, state.phase])

  if (state.phase === 'StartPage') {
    return (
      <StartPage
        credits={creditsStore}
        onPlay={() => {
          void audio.unlock()
          setState(play(state))
        }}
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
        onPlayAgain={() => setState(playAgain(state))}
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

  return <main aria-label="Playing">Match in progress</main>
}
