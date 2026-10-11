import {
  boot,
  enterBurnout,
  enterRecovery,
  exitRecovery,
  loadingComplete,
  loadingFailed,
  notifyDopamineDepleted,
  play,
  playAgain,
  returnToHub,
} from './gameState'

describe('Match state machine', () => {
  it('boots on Start Page without a Match clock', () => {
    expect(boot()).toEqual({
      phase: 'StartPage',
      matchClockRunning: false,
    })
  })

  it('moves from Start Page to Loading on PLAY without starting drain', () => {
    expect(play(boot())).toEqual({
      phase: 'Loading',
      matchClockRunning: false,
    })
  })

  it('starts Match eligibility only after Loading completes', () => {
    const state = loadingComplete(play(boot()))

    expect(state).toEqual({
      phase: 'Playing',
      modifier: 'Normal',
      matchClockRunning: true,
      systemsStopped: false,
    })
  })

  it('fails closed on Loading validation errors', () => {
    const loading = play(boot())

    expect(loadingFailed(loading, 'Starter pack is incomplete')).toEqual({
      phase: 'Loading',
      matchClockRunning: false,
      error: 'Starter pack is incomplete',
    })
  })

  it('enters Game Over immediately when Dopamine is depleted', () => {
    const playing = loadingComplete(play(boot()))

    expect(notifyDopamineDepleted(playing)).toEqual({
      phase: 'GameOver',
      matchClockRunning: false,
      systemsStopped: true,
    })
  })

  it('leaves Game Over through PLAY AGAIN or the full hub', () => {
    const gameOver = notifyDopamineDepleted(loadingComplete(play(boot())))

    expect(playAgain(gameOver)).toEqual({
      phase: 'Loading',
      matchClockRunning: false,
    })
    expect(returnToHub(gameOver)).toEqual({
      phase: 'StartPage',
      matchClockRunning: false,
    })
  })

  it('models Burnout and Recovery as modifiers of the same Playing Match', () => {
    const playing = loadingComplete(play(boot()))
    const burnout = enterBurnout(playing)
    const recovery = enterRecovery(burnout)

    expect(burnout).toMatchObject({ phase: 'Playing', modifier: 'Burnout' })
    expect(recovery).toMatchObject({ phase: 'Playing', modifier: 'Recovery' })
    expect(exitRecovery(recovery)).toEqual(playing)
  })
})
