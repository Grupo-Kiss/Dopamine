# artgen — offline generators for `content/`

Not part of the game build. Nothing in the app imports this; it exists so the
raster assets under `content/` can be re-derived instead of re-drawn.

```bash
cd tools/artgen && npm install
npm run minigames   # rewrite every content/minigames/ asset + the three playfield mockups
npm run verify      # render-check all of content/ (every SVG, PNG, WebP, JSON)
npm run preview     # scratch renders to /tmp/artgen-preview/ — never touches content/
```

Rendering is `@resvg/resvg-js` for SVG→PNG and `sharp` for WebP and
compositing. No browser, no headless Chrome.

## Coverage

**`npm run minigames` regenerates Phase E only** — `content/minigames/**` plus
`content/mockups/minigame_{lane,runner,blocks}.{svg,webp}`. Output is
byte-reproducible, so a clean re-run leaves `git status` empty.

The Phase A–D generators (Start Page, hub views, window chrome kits, icons)
were scratch scripts and are **not** preserved here. Their committed SVGs are
the masters; the shared language they were built from survives in `lib/`, so
rebuilding an emitter against `lib/` is the path forward rather than starting
over. `npm run verify` still checks those assets.

## Layout

| Path | Role |
| --- | --- |
| `lib/render.mjs` | file I/O, rasterization, data URIs; resolves repo root from its own location |
| `lib/brand.mjs` | locked palette + geometry helpers (`rr`, `rng`, `mix`) |
| `lib/stage.mjs` | GitHub-dark stage, violet bloom, CRT overlay |
| `lib/chrome.mjs` | OS window frame, traffic lights, accent glow |
| `lib/card.mjs` | cardboard cutout construction (`piece`, `print`, `eye`) |
| `lib/cast.mjs` | soldier, enemy, boss |
| `lib/props.mjs` | bevelled primitives, hazards, pickups, FX |
| `lib/tex.mjs` | ground tiles, backdrop, lane guide |
| `lib/playfields.mjs` | the three playfields, tetromino tables, `letterbox` |
| `lib/mockup.mjs` | review-sheet composition (window + rail + legend) |
| `phaseE_*.mjs` | the emitters that actually write files |

## Determinism

Two things would otherwise make re-runs churn, and both are handled:

- **Randomness** goes through `rng(seed)` in `lib/brand.mjs`, never
  `Math.random`, so star fields and grunge come out the same every time.
- **PNG density** is stripped by `stripDensity` in `lib/render.mjs`. libvips
  writes a `pHYs` chunk derived from image resolution, and builds disagree on
  whether 72dpi rounds to 2834 or 2835 pixels-per-metre — enough to rewrite
  every PNG with zero pixel changes.

Keep both intact. A generator that reports 38 modified files on a no-op run
teaches everyone to ignore its diff.
