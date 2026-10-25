import { createFakeAudioPort } from '../testing/audio'
import { createAudioMixer } from './mixer'
import {
  DOMAIN_CUE_IDS,
  resolveCue,
  type SfxCueManifest,
} from './cues'

const FIXTURE_MANIFEST: SfxCueManifest = {
  version: 1,
  cues: [
    {
      id: 'sfx_chain_step',
      path: 'content/minigames/_shared/sfx_sticker_chain_step.ogg',
      bus: 'bus_reward',
      status: 'final',
      license: 'owned',
      attribution: '',
    },
    {
      id: 'sfx_alert_normal',
      path: 'content/sfx/alerts/normal.ogg',
      bus: 'bus_alert',
      status: 'final',
      license: 'owned',
      attribution: '',
    },
    {
      id: 'sfx_ld_hit',
      path: 'content/minigames/lane_defender/sfx_hit.ogg',
      bus: 'bus_minigame',
      status: 'final',
      license: 'owned',
      attribution: '',
    },
  ],
}

describe('sfx: Focus Chain step / alert open / minigame hit dispatch named cue ids through mixer', () => {
  it('maps domain events to stable cue ids (no filenames)', () => {
    expect(DOMAIN_CUE_IDS.focusChainStep).toBe('sfx_chain_step')
    expect(DOMAIN_CUE_IDS.alertOpen).toBe('sfx_alert_normal')
    expect(DOMAIN_CUE_IDS.minigameHit).toBe('sfx_ld_hit')

    for (const id of Object.values(DOMAIN_CUE_IDS)) {
      expect(id.includes('.ogg')).toBe(false)
      expect(id.includes('/')).toBe(false)
    }
  })

  it('plays cues by id through the mixer without hard-coded filenames', () => {
    const port = createFakeAudioPort()
    const mixer = createAudioMixer(port, { manifest: FIXTURE_MANIFEST })

    mixer.playCue(DOMAIN_CUE_IDS.focusChainStep)
    mixer.playCue(DOMAIN_CUE_IDS.alertOpen)
    mixer.playCue(DOMAIN_CUE_IDS.minigameHit)

    expect(port.calls.filter((call) => call.operation === 'playCue')).toEqual([
      { operation: 'playCue', id: 'sfx_chain_step', bus: 'sfx' },
      { operation: 'playCue', id: 'sfx_alert_normal', bus: 'sfx' },
      { operation: 'playCue', id: 'sfx_ld_hit', bus: 'sfx' },
    ])
  })

  it('resolves cue metadata from the manifest by stable id', () => {
    const cue = resolveCue(FIXTURE_MANIFEST, 'sfx_chain_step')
    expect(cue.id).toBe('sfx_chain_step')
    expect(cue.bus).toBe('bus_reward')
    expect(() => resolveCue(FIXTURE_MANIFEST, 'missing_cue')).toThrow(
      /unknown cue/i,
    )
  })
})
