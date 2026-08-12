import { useState } from 'react'
import { StartPage } from './components/StartPage/StartPage'
import type { GamePhase } from './core/gamePhase'
import { GAME_TITLE } from './config/tunables'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('startPage')

  return (
    <>
      {phase === 'startPage' ? (
        <StartPage onPlay={() => setPhase('loading')} />
      ) : (
        <div className="phase-stub" role="status">
          <p>
            {GAME_TITLE} — <strong>{phase}</strong> (next surface)
          </p>
          <button type="button" onClick={() => setPhase('startPage')}>
            Back to Start Page
          </button>
        </div>
      )}
    </>
  )
}
