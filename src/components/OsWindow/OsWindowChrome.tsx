/** Shared OS window chrome — Start Page, Credits, and later hubs. */
export function OsWindowChrome({ title }: { title: string }) {
  return (
    <header className="os-window__chrome">
      <span className="os-window__traffic" aria-hidden="true">
        <i className="os-window__dot os-window__dot--close" />
        <i className="os-window__dot os-window__dot--min" />
        <i className="os-window__dot os-window__dot--max" />
      </span>
      <span className="os-window__title-chip">{title}</span>
    </header>
  )
}
