export type LoadingViewProps = {
  readonly error?: string
}

export function LoadingView({ error }: LoadingViewProps) {
  return (
    <main aria-label="Loading" className="loading-view">
      <p className="eyebrow">Preparing the feed</p>
      <h1>Loading Dopamine</h1>
      <p>Validating the starter pack…</p>
      {error && (
        <p className="loading-view__error" role="alert">
          {error}
        </p>
      )}
    </main>
  )
}
