import type { CSSProperties, ReactNode } from 'react'

import './Layout.css'
import type { DesktopLayout, LayoutModel, PermanentWindow } from './layoutModel'

export type LayoutProps = {
  readonly model: LayoutModel
  readonly dopamine: number
  readonly childrenByWindow?: Partial<
    Readonly<Record<PermanentWindow, ReactNode>>
  >
}

export function Layout({
  model,
  dopamine,
  childrenByWindow = {},
}: LayoutProps) {
  const style = {
    '--layout-gutter': `${model.gutterPx}px`,
    '--layout-inset': `${model.outerInsetPx}px`,
  } as CSSProperties

  return (
    <section
      aria-label="Playing layout"
      className={`playing-layout playing-layout--${model.kind.toLowerCase()}`}
      style={style}
    >
      <div className="playing-layout__masonry">
        {model.kind === 'Desktop'
          ? renderDesktop(model, childrenByWindow)
          : model.windows.map((window) => (
              <WindowSlot key={window} window={window}>
                {childrenByWindow[window]}
              </WindowSlot>
            ))}
      </div>

      <aside className="dopamine-bar">
        <span>Dopamine</span>
        <meter
          aria-label="Dopamine"
          aria-valuenow={dopamine}
          max={100}
          min={0}
          value={dopamine}
        />
      </aside>

      <div
        aria-label="Alerts overlay"
        className="alerts-overlay"
        id="alerts-root"
        role="region"
      />
    </section>
  )
}

function renderDesktop(
  model: DesktopLayout,
  children: LayoutProps['childrenByWindow'],
) {
  const minigameSide = model.topBand[0].kind === 'Window' ? 'left' : 'right'

  return (
    <>
      <div
        className={`playing-layout__top-band playing-layout__top-band--minigame-${minigameSide}`}
      >
        {model.topBand.map((region) =>
          region.kind === 'Window' ? (
            <WindowSlot key={region.window} window={region.window}>
              {children?.[region.window]}
            </WindowSlot>
          ) : (
            <div className="playing-layout__service-stack" key="services">
              {region.windows.map((window) => (
                <WindowSlot key={window} window={window}>
                  {children?.[window]}
                </WindowSlot>
              ))}
            </div>
          ),
        )}
      </div>
      <div className="playing-layout__bottom-band">
        {model.bottomBand.map((window) => (
          <WindowSlot key={window} window={window}>
            {children?.[window]}
          </WindowSlot>
        ))}
      </div>
    </>
  )
}

function WindowSlot({
  window,
  children,
}: {
  readonly window: PermanentWindow
  readonly children?: ReactNode
}) {
  return (
    <article
      aria-label={window}
      className={`window-slot window-slot--${window.toLowerCase()}`}
    >
      {children ?? <span>{window}</span>}
    </article>
  )
}
