# artgen — offline generators for `content/`

Not part of the game build. Nothing in the app imports this; it exists so the
raster assets under `content/` can be re-derived instead of re-drawn.

```bash
cd tools/artgen && npm install
npm run minigames   # rewrite every content/minigames/ asset + the three playfield mockups
npm run layouts     # rewrite the B1/B2 Playing layout comps (desktop_layout, mobile_layout)
npm run verify      # render-check all of content/ (every SVG, PNG, WebP, JSON)
npm run preview     # scratch renders to /tmp/artgen-preview/ — never touches content/
```

Rendering is `@resvg/resvg-js` for SVG→PNG and `sharp` for WebP and
compositing. No browser, no headless Chrome.

## Coverage

**`npm run minigames` regenerates Phase E only** — `content/minigames/**` plus
`content/mockups/minigame_{lane,runner,blocks}.{svg,webp}`. Output is
byte-reproducible, so a clean re-run leaves `git status` empty.

**`npm run layouts` regenerates Phase B1/B2** —
`content/mockups/{desktop,mobile}_layout.{svg,webp}`. These comps are
*composed*, not redrawn: `lib/compose.mjs` lifts the window interiors out of
the committed `window_*.svg` mockups, the title-bar icons out of
`content/icons/`, the stickers out of `content/ui/stickers/` and the Alert
cards out of `window_alerts.svg`. Edit those masters, then re-run `layouts`
so the comps follow. Desktop drops each interior into its slot at a fixed
scale (`fitInterior`); mobile re-arranges clipped panels of the same interior
(`region`) because the whole desktop interior would be unreadable at phone
width.

The Phase A–D generators (Start Page, hub views, window chrome kits, icons)
were scratch scripts and are **not** preserved here. Their committed SVGs are
the masters; the shared language they were built from survives in `lib/`, so
rebuilding an emitter against `lib/` is the path forward rather than starting
over. `npm run verify` still checks those assets.

## Fonts

`fonts/Teko-SemiBold.ttf` is a Latin subset of Teko (OFL, see
`fonts/OFL-Teko.txt`) at the one weight the art uses. Phase C was rendered
with real Teko, so the layout comps pass it to the rasterizer explicitly
(`rasterize(svg, w, { fonts: DISPLAY_FONTS })`). Phase E does not: it was
rendered on system fonts only, and opting it in would rewrite its WebPs.
Public Sans comes from the system in both cases.

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
| `lib/playfields.mjs` | the three playfields, tetromino tables, `letterbox`, `laneSlot` (in-world ground past 3:4) |
| `lib/mockup.mjs` | review-sheet composition (window + rail + legend) |
| `lib/compose.mjs` | lift interiors / icons / stickers / Alert cards out of committed SVGs; fit them into slots |
| `lib/meter.mjs` | Dopamine meter at any size and fill, interpolating the B3 samples |
| `phaseE_*.mjs` | the emitters that actually write files |
| `phaseB_layouts.mjs` | B1/B2 layout comps (`node phaseB_layouts.mjs desktop` or `mobile` for one) |

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
