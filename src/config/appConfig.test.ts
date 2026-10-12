import { createAppConfig } from './appConfig'

describe('optional content provider config', () => {
  it('defaults every provider off without env', () => {
    expect(createAppConfig({})).toEqual({
      providers: {
        pixabay: { enabled: false, apiKeyEnv: 'PIXABAY_API_KEY' },
        pexels: { enabled: false, apiKeyEnv: 'PEXELS_API_KEY' },
        jamendo: {
          enabled: false,
          clientIdEnv: 'JAMENDO_CLIENT_ID',
          commercialCleared: false,
        },
      },
    })
  })

  it('does not enable a provider from a flag without its key', () => {
    expect(
      createAppConfig({
        VITE_PIXABAY_ENABLED: 'true',
        VITE_PIXABAY_API_KEY: '',
      }).providers.pixabay.enabled,
    ).toBe(false)
  })
})
