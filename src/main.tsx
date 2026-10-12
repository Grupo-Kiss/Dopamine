import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { createAudioMixer } from './audio/mixer'
import { createWebAudioPort } from './audio/webAudioPort'

const root = document.querySelector<HTMLDivElement>('#root')

if (!root) {
  throw new Error('Missing #root mount point')
}

const audio =
  typeof AudioContext === 'undefined'
    ? undefined
    : createAudioMixer(createWebAudioPort(() => new AudioContext()))

createRoot(root).render(
  <StrictMode>
    <App audio={audio} />
  </StrictMode>,
)
