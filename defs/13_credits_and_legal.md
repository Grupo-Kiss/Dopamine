# Credits And Legal

## Purpose

This document is the authority for **credits surfaces**, **attribution data**, **license obligations**, **parody / trademark boundaries**, and the **human checklist** before shipping with third-party or API media.

Content sourcing mechanics: `08_content.md`. Feel of Start Page / Game Over: `09_game_feel.md`. Env / providers: `10_tech.md`. Tests do not replace legal review (`11`).

This is **not** formal legal advice. When commercializing or enabling APIs, a human must confirm terms against the live provider pages.

---

## Hard Rules

1. **No copyright risk** — only owned, explicitly licensed, or API-cleared media (`08`).
2. **No real-platform branding** — no logos, wordmarks, watermarks, or identifiable UI clones of TikTok / Reels / Shorts / Twitter / X / Bluesky / Spotify / Apple Music / YouTube / etc.
3. **Parody, not imitation** — fictional services (Loop, Pulse, Wave, Echo, Alerts); legally distinct presentation (`01` / `00`).
4. **Local-first** — providers default `enabled: false`; never ship secrets.
5. **Attribution is data** — every third-party (and API-ingested) item carries `license` + `attribution` into a credits store; UI can always list them.
6. **Credits are reachable** — Credits Modal via link on Start Page and Game Over (and About if added). Loading splash is **not** the sole credits surface.

---

## Credits UI

Attribution lists get long (many media files + OSS). Do **not** dedicate a full route or replace the Start Page / Game Over composition with a wall of credits.

### Presentation: modal

- **Credits Modal** — scrollable overlay/dialog over the current hub surface (Start Page or Game Over).
- Opened by a **Credits** text link (or equivalent control) on Start Page and Game Over.
- Close returns to the same hub; does not start Loading or change Match state.
- Long third-party lists live **inside** the modal (grouped / searchable later if needed); the hub only needs the short link.
- Optional About later may open the same modal.

### Required entry points

| Surface | Requirement |
| --- | --- |
| **Start Page** | “Credits” link opens Credits Modal |
| **Game Over** | Same link among adapted info blocks (`09`) |
| Optional About | May open the same modal |

### Modal content (minimum)

1. **Game** — title, short one-liner, studio / authors as you define.
2. **Third-party media** — scrollable list from the credits store (title / creator / license / source). Expect a long list; keep it in the modal, not on the hub.
3. **Fonts / libraries** — npm and font licenses that require notice.
4. **Provider notices** — when a provider was used this build/session, required courtesy lines.
5. **Disclaimer** — satire; not affiliated with any real social or streaming platform.

English UI (`09`). Keep readable under Accessibility Mode (no essential info only in motion). Trap focus in the modal; Esc closes.

### In-Match attribution

- Do **not** clutter gameplay with permanent watermark bars.
- Optional subtle per-item credit on Wave/Echo detail chrome is allowed if a license demands visible credit **during** playback — prefer satisfying that via the Credits Modal unless the license text requires on-screen credit.
- Pixabay “show where results come from” applies when **displaying search results**; in-game playback of cached items still lists those items in the Credits Modal.

---

## Attribution Data Model

Every media manifest entry and every API-cached item must support:

```ts
type CreditRecord = {
  id: string;
  kind: 'loop' | 'wave' | 'echo' | 'sfx' | 'image' | 'font' | 'library' | 'other';
  title: string;
  creatorLabel: string;      // artist / uploader / package author
  license: string;           // e.g. owned | CC0 | CC-BY-4.0 | Pixabay | Pexels | URL
  attribution: string;       // human-readable credit line (may be empty if owned + no duty)
  sourceUrl?: string;        // original page when known
  provider?: 'local' | 'pixabay' | 'pexels' | 'jamendo' | 'freesound' | 'other';
  usedInMatch?: boolean;     // optional: highlight items that appeared this Match
};
```

Rules:

- `license` is required for preload validation (`08`). Missing → fail closed.
- `attribution` empty only when `license` is `owned` / `CC0` / equivalent with no credit duty.
- API ingest **persists** license + attribution + ids into Match cache and merges into the credits store for the session/build.
- First-party minigame art and window icons: mark `license: "owned"` (or project license) so the pipeline stays uniform.

Ship a build-time or runtime aggregator that unions:

- static manifests under `content/`
- enabled API cache entries
- `package.json` notices file (or hand list) for OSS

---

## License Categories (practical)

| Category | Use in Dopamine | Credits duty |
| --- | --- | --- |
| `owned` | Preferred for shipping | Optional author line |
| `CC0` / public domain | OK | Usually none; still list title/source if known |
| `CC-BY*` | OK if terms allow game embedding | Credit line required |
| `CC-NC*` / NC API | **Not** for monetized builds without clearance | N/A until cleared |
| Pixabay Content License | OK as part of larger work; no standalone redistribution | Follow Pixabay attribution/API notes; list in Credits |
| Pexels License | OK; attribution encouraged | List in Credits |
| Jamendo track CC + API terms | Local preferred; API only if non-commercial OK **or** commercial deal | Per-track CC + Jamendo |
| Unknown / missing | **Reject** — do not ship or preload | — |

Do not hotlink when the provider forbids permanent hotlinking; prefer download/cache to our origin (`08`).

---

## Provider Obligations (summary)

Authoritative API notes live in `08`. Credits implications:

| Provider | Enable gate | Credits |
| --- | --- | --- |
| **Pixabay** | Key + accept Content License; no mass scrape; cache ~24h | List each used asset; respect “results source” when showing search UI |
| **Pexels** | Key + rate limits | List each used asset (encouraged / API expectation) |
| **Jamendo** | `commercialCleared` for monetized prod; else local Wave only | Per-track `license_ccurl` text/link in Credits |
| **Freesound** | Commercial API access if needed; respect per-sound CC/NC | Per-sound credit |

**Forbidden backends:** Spotify, YouTube download/scrape, Apple Music, Twitter/X firehose, or any ToS that forbids this use (`08`).

Human pin: populate `.env` only when enabling (`_PINS.md`); keep `enabled: false` until keys **and** legal OK.

---

## Parody And Trademarks

- Service names **Loop / Pulse / Wave / Echo / Alerts** only in product UI.
- Window chrome is caricaturesque, not a pixel clone of a real app (`CONTEXT` Window Art / `09`).
- Brand-adjacent **colors** (e.g. Pulse blue, Wave green) are satire-adjacent — lock consciously before high-fi (`_PINS.md`); never ship real logos or wordmarks.
- Pulse copy is fictional; no real private individuals’ data; no slogan that implies endorsement (`08`).
- Disclaimer on Credits: not affiliated with or endorsed by any real platform.

---

## Open-Source And Fonts

- Prefer dependencies with permissive licenses (MIT, Apache-2.0, BSD, ISC).
- Maintain a `NOTICE` or in-app OSS section listing packages that require attribution.
- Embed only fonts you may redistribute; put license text in Credits / `NOTICE`.
- Generate or update the OSS list when adding deps (scaffold / CI reminder later).

---

## Privacy

- No accounts, no backend, no required analytics (`01` / `10`).
- `localStorage` for Accessibility Mode / volume only — not sold, not PII catalog.
- If analytics are added later, that needs a new ADR + privacy copy — out of scope until then.

---

## Human Checklist (before release / before enabling APIs)

- [ ] Every `content/` media file has manifest `license` (+ `attribution` when required)
- [ ] No real-platform logos or trademarked UI in shipping assets
- [ ] Credits Modal reachable from Start Page and Game Over links
- [ ] Credits list matches shipped third-party media
- [ ] Providers still `enabled: false` **or** keys present, terms re-read, Jamendo commercial cleared if monetized
- [ ] `.env` / secrets not committed; `.env.example` has empty placeholders only
- [ ] OSS / font notices included
- [ ] Satire disclaimer present
- [ ] Legal human OK for the intended distribution (free vs monetized)

---

## Implementation Notes

- Credits store is readable while on Start Page (static pack) and after a Match (include `usedInMatch` if implemented).
- Tests (`11`): preload rejects missing license; Credits Modal renders a fixture list — full license review remains human.
- Coding (`12`): no secrets in repo; providers default off.

---

## Acceptance Criteria

- Credits Modal opens from Start Page and Game Over links (splash alone is insufficient).
- Attribution model covers local manifests and API-ingested items.
- Provider enablement is gated on legal OK; Jamendo monetized use requires explicit clearance flag.
- Parody / no real-platform branding rules are explicit and testable at asset review.
- Human checklist exists for release and API enablement.
- Privacy stance matches frontend-only scope.
