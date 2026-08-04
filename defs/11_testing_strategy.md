# Testing Strategy

## Purpose

This document defines **how behavior is verified**: TDD cadence, test layers, what must be covered from the specs, tooling, determinism rules, and CI expectations.

You should already treat TDD as mandatory from `00_IMPLEMENTATION_GUIDE.md` and `docs/adr/0001-tdd-after-docs.md`. This file does **not** introduce the process late — it maps **what to test** and in what order once you start a coding slice.

Gameplay authority: `02`–`05`. Numbers: `06`. Layout: `07`. Content: `08`. Feel: `09`. Stack: `10`. Coding practice: `12`.

---

## Process (non-negotiable)

1. Specs for the slice exist and are readable (`00` reading order).
2. Write a **failing** test that encodes the intended behavior from the defining doc.
3. Write the **minimal** code to pass.
4. Refactor while green.
5. Do not ship behavior that only exists in UI polish without a core or contract test when the rule is gameplay-critical.

Documentation-first, then TDD — not the reverse (ADR-0001).

**Per feature:** open the owning def (`02`–`09` as relevant) → write the failing test → implement → only then move to the next behavior. Do not batch-implement a whole window and “add tests later.”

---

## Tooling

| Layer | Tool | Role |
| --- | --- | --- |
| Unit / domain | **Vitest** | Core rules, pure functions, state machine |
| React UI | **Vitest** + **Testing Library** | Start Page, HUD stickers hosts, layout smoke |
| Canvas minigames | Vitest (logic) + thin harness | Lane/Board/Runner **rules** without pixels-as-oracle |
| E2E smoke | **Playwright** (optional until core is green) | Start Page → PLAY → Loading → Playing visible |
| CI | `pnpm test` (+ lint/build) | Required; E2E optional job |

Prefer **co-located** `*.test.ts` / `*.test.tsx` next to the module under test (`10`). Shared fixtures live under `src/test/` or `src/testing/`.

---

## Test Pyramid

```
        /\
       /E2E\          few smokes — boot + one happy path
      /------\
     / UI TL  \       Start Page, key chrome, a11y toggle persistence
    /----------\
   /  Adapters  \     input router, content preload gate, audio bus fakes
  /--------------\
 /  Core domain   \   majority — Dopamine, Focus Chain, Burnout, difficulty,
/__________________\  window reward tables, Discovery vs Anticipation
```

**Core is the product.** If a rule is in `02`–`06`, it gets a domain test. React and canvas are adapters.

---

## What Core Must Lock

Map tests to the defining doc. Constant **names** and starter values come from `06_balance.md`.

### State machine (`02`)

- Boot lands on **Start Page** (no Dopamine drain).
- PLAY → **Loading** → **Playing** (Match clock / drain start only in Playing).
- Playing → Burnout → Recovery → Playing; APM threshold escalates after each completed Recovery and never decreases mid-Match.
- Dopamine ≤ 0 → **Game Over** immediately; PLAY AGAIN → Loading; hub path → Start Page.
- Loading validation failure does not enter Playing.

### Dopamine (`02` / `06`)

- Passive drain only; **no** direct penalty subtraction helpers exist or are callable from fail paths.
- Drain uses difficulty mult and Recovery mult formula from `06`.
- Positive gains from interactions; diminishing returns logarithmic floor.
- **Anticipation** builds while waiting for payoff; resets on obtain / leave / expire.
- **Discovery** (Wave) grants on unheard tracks; already-heard skips do not farm Discovery; systems stay distinct in API and tests.

### Focus Chain (`02` / `06`)

- Extends on valid Focus Change to Normal / Focus Ready / Attention Request.
- **Waiting** (cooldown) destination does not extend; farming cooldown windows breaks chain.
- Focus Ready improves **quality**, not eligibility.
- Decaying continue-window `timeoutMs(L)` matches `06` formula; expiry resets to 0.
- Completion bonus only if final length ≥ min; no clawback of step bonuses; length 1–2 end pays no completion.
- Burnout / Recovery do not break the chain.

### Input (`02`)

- Priority: text → Alert → Active Window → navigation.
- **R = Repost**; **Y = Echo** navigation; Like=L, Next=N consistency.
- Hover alone does not change Active Window; nav shortcuts and valid interactions do.

### Difficulty (`05` / `06`)

- Continuous curve; no discrete level flags.
- Does not change controls, rule formulas, or scoring formulas — only density/pressure multipliers under test.

### Burnout (`02` / `06`)

- Telegraph at `BURNOUT_TELEGRAPH_APM_RATIO`.
- Enter/exit sustain windows; reward mult while active; Recovery duration fixed.

### Windows & minigames (`03` / `04` / `06`)

- Per-action reward tables honor `06` (including ads/spam = 0 Dopamine).
- Minigame failure **resets minigame only** — Dopamine / score / chain / difficulty preserved.
- Wave: Discovery vs Anticipation paths covered with separate fixtures.
- Alerts: open can extend Focus Chain; spam rewards 0.

### Content preload (`08` / `06`)

- Starter-pack gate blocks Playing until required counts validate.
- Missing manifest / license fields fail closed.
- Providers default disabled without env (local-first).

### Layout (contract smoke) (`07`)

- Desktop: five permanent windows + overlay Alerts; Dopamine bar outside masonry.
- Mobile: Minigame + exactly two services.
- Prefer structural assertions (slot counts / roles) over pixel diffs.

### Feel (selective) (`09`)

- Accessibility Mode flag reduces motion intensity path (stubbed FX).
- Game Over silence / mixer suspend callable.
- Do **not** snapshot Balatro-energy animation frames as primary oracles.

---

## Determinism Rules

- Inject **clock** / `now` / dt; never depend on real `Date.now()` or RAF in domain tests.
- Inject **RNG** for Minigame pick, layout shuffle, Song Moment placement, content picks.
- Fake media: no real network, decode, or Autoplay in unit tests — ports return fixtures.
- Fake AudioContext / GainNode graph with recordable bus messages.
- Balance module: single import; tests that lock “never direct penalty” and Discovery ≠ Anticipation stay green when constants are tuned (behavior shape, not every float forever — prefer named-constant equality to `06` exports).

---

## TDD Order (matches `00` / `10` scaffold)

1. Vitest harness green  
2. State machine  
3. Dopamine (+ diminishing, Anticipation)  
4. Focus Chain (+ quality tiers, timeout decay, completion)  
5. Input router (incl. R vs Y)  
6. Burnout / Recovery / telegraph  
7. Difficulty multipliers  
8. Content preload gate  
9. Wave Discovery vs Anticipation  
10. One minigame rule core → then other two  
11. Remaining window reward / Attention Request behaviors  
12. React Start Page / Layout smoke  
13. Audio mixer unit fakes  
14. Playwright smoke (after Playing shell exists)

Do not start E2E before core state + Dopamine + Focus Chain are covered.

---

## Definition Of Done (slice)

A gameplay slice is done when:

- Failing tests were written first for the new rules.
- Acceptance criteria bullets in the owning def are reflected as tests (or explicitly deferred in `_PINS.md`).
- No direct Dopamine removal API slipped in.
- Glossary terms from `CONTEXT.md` appear in test names/descriptions where domain language matters.
- `pnpm test` passes locally (and in CI when present).

---

## Out Of Scope For Automated Tests (v1)

- Subjective “juiciness” / sticker beauty
- Full legal review of third-party licenses (tracked in `13` + human checklist)
- Playtest balance feel (tune `06`; keep formulas tested)
- Optional live API providers until keys + legal OK (pin: populate `.env`)

---

## Acceptance Criteria

- TDD cadence and ADR-0001 are the delivery method.
- Core domain holds the majority of tests and can run without React/canvas.
- Discovery and Anticipation have separate fixtures and assertions.
- State machine includes Start Page and Loading, not only Playing.
- Deterministic clock/RNG/media/audio fakes are required for domain tests.
- CI runs unit tests on every PR once the scaffold exists; E2E is optional smoke.
