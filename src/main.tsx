import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import sfxManifest from '../content/sfx/manifest.json'
import { App } from './App'
import type { SfxCueManifest } from './audio/cues'
import { createAudioMixer } from './audio/mixer'
import { createWebAudioPort } from './audio/webAudioPort'

const root = document.querySelector<HTMLDivElement>('#root')

if (!root) {
  throw new Error('Missing #root mount point')
}

const audio =
  typeof AudioContext === 'undefined'
    ? undefined
    : createAudioMixer(createWebAudioPort(() => new AudioContext()), {
        manifest: sfxManifest as SfxCueManifest,
      })

createRoot(root).render(
  <StrictMode>
    <App audio={audio} />
  </StrictMode>,
)
