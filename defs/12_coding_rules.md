# Coding Rules

## Purpose

Daily engineering practice for Dopamine. Stack and folders: `10_tech.md`. What to test and TDD order: `11_testing_strategy.md`. Domain vocabulary: `CONTEXT.md`. Numbers: `06_balance.md` only.

---

## Delivery Cadence

1. Read the **owning** spec for the slice (not the whole handbook every time).
2. Write the **failing** test (`11`).
3. Write minimal TypeScript to pass.
4. Refactor; keep tests green.
5. Do not open a PR/slice that adds gameplay behavior without tests for that behavior.

If docs and code disagree, **fix the docs first** (SSOT), then fix code/tests — unless `_PINS.md` or an ADR says the doc is provisional and code is exploring. Default: docs win.

---

## Language And Types

- **TypeScript strict** (`strict: true`). No loosely typed escape hatches for core rules.
- Prefer `type` / discriminated unions for game states (Start Page | Loading | Playing | Burnout | Recovery | Game Over).
- Avoid `any`. Narrow `unknown` at boundaries (JSON manifests, env).
- Export balance constants with the **same names** as `06` (`DOPAMINE_MAX`, `FOCUS_CHAIN_TIMEOUT_BASE_MS`, …).

---

## Domain Vocabulary In Code

- Use glossary terms from `CONTEXT.md` for types, functions, files, and test titles: `Dopamine`, `FocusChain`, `ActiveWindow`, `StartPage`, `DiscoveryBonus`, `AnticipationBonus`, etc.
- Do **not** name things `health`, `hp`, `lives`, `mana`, or real-platform brands (`tiktok`, `spotify`, …).
- Do **not** conflate `FocusChain` with `Combo` / multiplier stickers.
- Do **not** conflate `DiscoveryBonus` with `AnticipationBonus`.

---

## Architecture Boundaries

| May | Must not |
| --- | --- |
| `src/core/*` own Match rules, pure or injectably timed | Import React, DOM, canvas, or Vite client APIs |
| `src/windows/*`, `src/minigames/*`, `src/components/*` adapt IO | Re-implement Dopamine/Focus Chain math locally |
| `src/audio/*` own Web Audio graph | Decide gameplay rewards |
| Tests call core with fakes | Rely on real network/decode/RAF for domain asserts |

React components **forward input and render state**. Canvas minigames **report** valid actions / failures into core; they do not end the Match on local death (`04`).

Public ports (interfaces) between core and adapters stay small and stable.

---

## Dopamine Safety

- No function that subtracts Dopamine as a penalty for failure, miss, or wrong action.
- Failures = missed opportunity + ongoing passive drain only (`02`).
- Code review / tests should reject APIs like `penalizeDopamine` / `damage` / `loseLife`.

---

## Balance And Config

- All tunable numbers live in one module mirrored to `06`. Change values in **one** place; update `06` in the same PR when shipping a deliberate tune.
- Feature flags / providers match `10` / `08`: default local content; APIs off until keys + legal OK.
- Never commit `.env` / `.env.local`. Ship `.env.example` with empty keys and comments only (scaffold time).

---

## Modules And Files

- Prefer co-located `*.test.ts` / `*.test.tsx`.
- One primary export concept per file when practical (`focusChain.ts`, `dopamine.ts`).
- Colocate window code under `windows/Loop`, etc.; minigames under `minigames/<id>/`.
- Shared test fakes: `src/testing/` (clock, rng, media, audio).

---

## React And UI

- Function components; keep Match rules out of JSX.
- Accessibility Mode and credits entry points stay reachable from Start Page / Game Over (`09`).
- Stickers/overlays must not permanently steal masonry layout slots (`07`).
- English system strings only for v1 (`09`).
- No photoreal OS clones or real-platform trademarks in assets or copy (`08` / `01`).

---

## Input

- Single router; priority from `02` (text → Alert → Active Window → navigation).
- **R = Repost**, **Y = Echo** navigation — do not “fix” collisions by overloading R.
- Keyboard must remain optional; mouse/touch paths call the same valid-interaction helpers.

---

## Async, Media, Audio

- Unlock AudioContext on PLAY (user gesture).
- Preload gate fail-closed (`08`); Playing must tolerate late progressive loads with placeholders — never freeze the sim.
- No `eval` of content packs; JSON/media only.

---

## Comments And Noise

- Prefer clear names over narrating comments.
- Comment only non-obvious invariants (e.g. “Waiting destinations do not extend Focus Chain”).
- No debug overlays or `console.log` spam in production builds (`10`).

---

## Git / PR Hygiene (when coding)

- Small commits per vertical slice (test + implementation).
- Do not mix unrelated balance rewrites with feature work unless the feature requires it.
- Base feature work on the agreed branch (`develop` when merging).

---

## Acceptance Criteria

- TDD is the default path for every gameplay behavior.
- Core stays React/canvas-free and fully tested under Vitest.
- Glossary and SSOT rules are visible in naming and PR structure.
- No direct Dopamine penalties; Discovery ≠ Anticipation in types and tests.
- Secrets stay out of the repo; providers default off.
