import { useState } from 'react'

import creditsStore from '../content/credits/store.json'
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

export function App() {
  const [state, setState] = useState<GameState>(() => boot())

  if (state.phase === 'StartPage') {
    return (
      <StartPage credits={creditsStore} onPlay={() => setState(play(state))} />
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
