# Tech Specification

## Purpose

This document defines **how the game is built**: stack, architecture boundaries, rendering, audio, content loading, config/env, build/deploy, and browser targets.

Gameplay rules: `02`–`05`. Numbers: `06`. Layout: `07`. Content: `08`. Feel: `09`. Testing details: `11_testing_strategy.md`. Code style: `12_coding_rules.md` (forthcoming).

---

## Hard Constraints (from product)

- **Frontend only** — no account, login, backend, or database (`01`).
- Deployable as **static files** to common web hosting.
- **Docs first, then TDD** (`docs/adr/0001-tdd-after-docs.md`).
- Optional media APIs default **off**; secrets never committed (`08`).
- English system UI; Accessibility Mode persisted locally (`09`).

---

## Recommended Stack

Chosen for a small static arcade app with DOM service windows + canvas minigames + Web Audio mixing.

| Layer | Choice | Why |
| --- | --- | --- |
| Language | **TypeScript** (strict) | Spec-driven domain; safe refactors under TDD |
| Bundler / dev | **Vite** | Fast refresh, static build, simple `public/` + asset pipeline |
| UI shell | **React 19** | Start Page, masonry layout, window chrome, stickers, Game Over |
| Minigames | **Canvas 2D** (own RAF loops) | Lane Defender / Runner / Block Cascade stay lightweight; no full engine required for v1 |
| Unit / component tests | **Vitest** (+ Testing Library for React) | Matches Vite; TDD loop |
| E2E (later) | **Playwright** (optional slice) | Smoke: Start Page → PLAY → Playing visible |
| Lint / format | **ESLint** + **Prettier** | Conventions expanded in `12` |
| Package manager | **pnpm** | Lockfile + fast installs |

**Not in v1:** Phaser/Pixi (revisit only if canvas abstraction becomes painful), SSR/Next.js, service workers beyond simple static caching if needed later, any game server.

Stack pins may move only via ADR if a choice proves wrong.

---

## Runtime Architecture

### Domain vs UI

Keep Match rules **framework-agnostic** under `src/core/`:

- game state machine (Start Page → Loading → Playing → Burnout/Recovery → Game Over)
- Dopamine, Focus Chain, Burnout, difficulty, scoring, input routing
- window/minigame **ports** (interfaces) that React/canvas adapters implement

React components **render and forward input**; they do not own Dopamine math.

### Main loop

- **Simulation tick** (fixed or measured dt) advances core systems while in Playing / Burnout / Recovery.
- **Minigame** runs its own canvas RAF while mounted; reports valid actions / failures into core.
- **DOM windows** update from core subscriptions / props; media elements (video/audio) are controlled by window modules.
- Start Page / Loading / Game Over are discrete UI modes driven by the same state machine — no Match drain on Start Page.

### Input

Single input router (`02`):

1. Active text input  
2. Active Alert  
3. Active Window actions  
4. Global navigation (`Q/W/E/Y/T`, etc.)

Pointer/touch and keyboard both call the same “valid interaction” paths so Focus Chain / Active Window stay consistent.

---

## Rendering Split

| Surface | Tech |
| --- | --- |
| Start Page, Loading splash, Game Over | React DOM |
| Desktop/mobile masonry + window chrome | React DOM (+ CSS variables from `09` palettes) |
| Dopamine bar + sticker overlays | React DOM (absolute/fixed layers; do not resize masonry) |
| Alerts | React portal / overlay root above layout |
| Minigame playfield | `<canvas>` letterboxed in slot (`09` aspect rules) |
| Loop video | `<video>` (or equivalent) inside Loop chrome |
| Wave / Echo audio | `HTMLMediaElement` and/or Web Audio graph |

Stage background / gutters: near-black CSS as in `09`.

---

## Audio

Use the **Web Audio API** for a small bus mixer (`09`):

- Priority ducks and **focus muffling** (Gain + lowpass per bus)
- Burnout: no muffling; Wave may saturate within a master limiter
- Recovery: extra global muffling, ease out
- Game Over: hard silence (suspend/stop graph)

Wave music bed and Echo playback feed into buses; SFX on higher-priority buses. Do not rely on only element `volume` if muffling must be filter-based.

Autoplay policies: unlock AudioContext on first user gesture (Start Page PLAY is ideal).

---

## Content Loading

Authority: `08_content.md`.

1. **Start Page** — light UI assets only (icons, mock-level chrome).
2. **Loading** — validate manifests; preload starter pack counts from `06`; pick Minigame + layout shuffle; fail closed with error UI on splash.
3. **Playing** — background queue for remaining pack; never freeze the sim if an item is late (last safe item / placeholder).

Pathing:

- Authoring: repo-root `content/`
- Ship: Vite copies or imports into `public/` / bundled assets as decided at scaffold time
- Manifests carry `license` + `attribution` for credits (`13`)

Optional providers (Pixabay / Pexels / Jamendo): config flags default `false`; keys from env only.

---

## Configuration And Env

```ts
// Conceptual shape — exact module in src/
type AppConfig = {
  providers: {
    pixabay: { enabled: boolean; apiKeyEnv: 'PIXABAY_API_KEY' };
    pexels: { enabled: boolean; apiKeyEnv: 'PEXELS_API_KEY' };
    jamendo: {
      enabled: boolean;
      clientIdEnv: 'JAMENDO_CLIENT_ID';
      commercialCleared: boolean;
    };
  };
  accessibilityDefault?: boolean;
};
```

- `.env.local` / host env for secrets — **never commit**.
- Vite: only expose env via explicit `VITE_` (or server-less build-time inject) if a key must reach the client; prefer proxy-free **local content** in production builds unless legal/product explicitly enables APIs.
- Persist Accessibility Mode and muted/volume prefs in `localStorage` (no account).

Balance constants: import from a single module mirrored to `06_balance.md` (SSOT remains the doc; code values must match names).

---

## Project Layout (code)

Aligns with `00_IMPLEMENTATION_GUIDE.md`:

```
src/
  core/           # state, dopamine, focusChain, burnout, difficulty, scoring, input, events
  windows/        # Loop, Pulse, Wave, Echo, Alerts adapters
  minigames/      # lane_defender, endless_runner, block_cascade
  components/     # StartPage, Layout, HUD, Effects
  audio/          # Web Audio mixer buses
  content/        # manifest loaders, preload queue (reads shipped assets)
  config/
  tests/          # or co-located *.test.ts — decide in 11/12; prefer co-located
```

Repo-root `content/` stays the human drop zone.

---

## Browser Targets

- **Primary:** latest Chromium, Firefox, Safari (desktop).
- **Secondary:** iOS Safari / Android Chrome (mobile layout).
- Baseline: ES2020+, Canvas 2D, Web Audio, `<video>` / `<audio>`, CSS Grid/Flex, `localStorage`.
- No requirement for WebGPU in v1.
- Prefer feature detection over UA hacks; if Web Audio muffling fails, fall back to gain-only ducks.

---

## Build And Deploy

- `pnpm build` → static `dist/` (HTML/JS/CSS/assets).
- Host on any static provider (GitHub Pages, Netlify, S3+CDN, etc.).
- No server-side rendering.
- Cache-control: hashed assets immutable; `index.html` short cache.
- CI (when added): install → lint → unit tests → build. E2E optional job.

---

## Performance Budgets (starter)

| Budget | Target | Notes |
| --- | --- | --- |
| Initial JS (gzipped) | Keep lean; prefer code-split Start Page vs Playing | Exact cap in playtest |
| Loading starter pack | Short splash; counts in `06` | Fail clearly if missing |
| Frame | Minigame ~60fps when tab focused | Degrade particles before sim correctness |
| Audio | One AudioContext; limited simultaneous decodes | Progressive preload |

Do not ship debug overlays in production builds.

---

## Security / Privacy

- No PII collection; no analytics SDK required for v1.
- No eval of content-pack scripts — data/JSON/media only.
- Sanitize any future rich text in Pulse if HTML ever allowed (default: plain text).
- API keys: treat as compromised if embedded; local-first is the production default.

---

## Scaffold Order (when coding starts)

After asset gate + TDD readiness:

1. Vite + TS + React + Vitest skeleton  
2. Core state machine tests (Start Page → Loading → Playing → Game Over)  
3. Dopamine / Focus Chain modules under test  
4. Layout shell + Dopamine bar  
5. One minigame canvas + two stub windows  
6. Audio unlock + mixer stub  
7. Content preload gate  
8. Remaining windows / minigames / feel  

Exact test plan: see `11_testing_strategy.md`.

---

## Acceptance Criteria

- Stack choices are explicit and static-deploy compatible.
- Core rules are testable without mounting the full React tree.
- Start Page, Loading, and Playing are distinct technical modes matching `02`.
- Web Audio mixer capability exists for muffling / Burnout / silence.
- Content pipeline supports `content/` → shipped assets with manifest validation.
- Env/provider config matches `08` (default local-only).
- No backend or account surface is introduced.
