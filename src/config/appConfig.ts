export type AppConfig = {
  readonly providers: {
    readonly pixabay: {
      readonly enabled: boolean
      readonly apiKeyEnv: 'PIXABAY_API_KEY'
    }
    readonly pexels: {
      readonly enabled: boolean
      readonly apiKeyEnv: 'PEXELS_API_KEY'
    }
    readonly jamendo: {
      readonly enabled: boolean
      readonly clientIdEnv: 'JAMENDO_CLIENT_ID'
      readonly commercialCleared: boolean
    }
  }
}

export type AppEnv = Readonly<Record<string, string | undefined>>

export function createAppConfig(env: AppEnv): AppConfig {
  const jamendoCommercialCleared =
    env.VITE_JAMENDO_COMMERCIAL_CLEARED === 'true'

  return {
    providers: {
      pixabay: {
        enabled:
          env.VITE_PIXABAY_ENABLED === 'true' &&
          hasValue(env.VITE_PIXABAY_API_KEY),
        apiKeyEnv: 'PIXABAY_API_KEY',
      },
      pexels: {
        enabled:
          env.VITE_PEXELS_ENABLED === 'true' &&
          hasValue(env.VITE_PEXELS_API_KEY),
        apiKeyEnv: 'PEXELS_API_KEY',
      },
      jamendo: {
        enabled:
          env.VITE_JAMENDO_ENABLED === 'true' &&
          hasValue(env.VITE_JAMENDO_CLIENT_ID) &&
          jamendoCommercialCleared,
        clientIdEnv: 'JAMENDO_CLIENT_ID',
        commercialCleared: jamendoCommercialCleared,
      },
    },
  }
}

function hasValue(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}
