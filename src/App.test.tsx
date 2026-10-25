import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import sfxManifest from '../content/sfx/manifest.json'
import { type SfxCueManifest } from './audio/cues'
import { createAudioMixer } from './audio/mixer'
import { createFakeAudioPort } from './testing/audio'
import { App } from './App'

describe('app shell', () => {
  it('mounts a placeholder hub without requiring a Match', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: 'Dopamine hub' })).toBeVisible()
  })

  it('unlocks audio from the PLAY gesture', async () => {
    const user = userEvent.setup()
    const audioPort = createFakeAudioPort()
    render(<App audio={createAudioMixer(audioPort)} />)

    await user.click(screen.getByRole('button', { name: 'Play' }))

    expect(audioPort.calls).toContainEqual({ operation: 'unlock' })
  })

  it('PLAY loads the starter pack then mounts the Playing shell', async () => {
    const user = userEvent.setup()
    const audioPort = createFakeAudioPort()
    render(
      <App
        audio={createAudioMixer(audioPort, {
          manifest: sfxManifest as SfxCueManifest,
        })}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Play' }))

    await waitFor(() => {
      expect(screen.getByRole('main', { name: 'Playing' })).toBeVisible()
    })
    expect(screen.getByRole('region', { name: 'Playing layout' })).toBeVisible()
    expect(
      screen.getByRole('region', { name: 'Arcade stickers' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Match in progress')).toBeNull()
  })
})
