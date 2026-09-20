# SFX & Short Audio Production Brief

## Purpose

**Single source of truth for the short-audio pass** (UI / arcade / minigame / alert SFX). Complements the mix rules in `09_game_feel.md` and the Web Audio buses in `10_tech.md`.

This is **not** the Wave music catalog or Echo long-form beds — those stay in `08_content.md` (media packs / optional Jamendo).

**Visual PR #8 does not own this.** Drop `.ogg` files at the paths below when produced; until then the cue list + placeholders are enough for later TDD fakes.

Feel language / mix priority: `09`. Credits / licenses: `13`. Handoff status: `HANDOFF.md`.

---

## Audio personality (locked)

| Axis | Direction |
| --- | --- |
| **Prime directive** | Every meaningful action gets a **pleasant** sound that **empowers** and adds to Dopamine — never annoying, never harsh spam. Think polished phone-UI satisfaction (**iOS-like clarity/pleasure** as a *feel* reference), not a clone of Apple’s actual sounds. |
| Overall | Arcade-readable satire with rewarding ticks; minigame hits can be punchier, but still pleasant. Not cute-childish; not abrasive. |
| Combo juicy → bored | Early hits bright/satisfying; same-window repeats flatten (duller, shorter) — still not grating |
| Alerts | Distinct tiers, still pleasant; parody OS notifs **without** copying iOS/Android/Windows sound assets |
| Burnout telegraph | Rising tension that still feels like a reward-pressure cue, not a jump-scare |
| Game Over | **Boring / drained / no power** short cue (~0.5–1.5 s) → **hard silence**. The one intentional “low dopamine” sound — flat, tired, energy gone. Not a dramatic epic sting. |
| Legal | No recognisable commercial jingles or real OS/platform notif samples |

### Production source (locked)

| Preference | Detail |
| --- | --- |
| **1st** | **Generative SFX**, exported as **local `.ogg` files** committed under `content/` — **no streaming**, no runtime audio API, no keys |
| **2nd** | **Freesound** downloads for gaps — prefer **CC0**; if attribution-required CC is used, row must land in Credits (`13`) |
| Independence | Ship everything in the static build; player never depends on an external audio service at runtime |

### License bar (locked)

| Asset class | Bar |
| --- | --- |
| **SFX / short one-shots** (this brief) | Prefer **CC0** / public domain. Attribution-required OK only if credited. |
| **Content packs** (Wave/Loop/Echo media — `08`) | **Per-item licenses** in each manifest — may be more restrictive than CC0. Not forced to CC0. |
| **NC** | Owner will **not sell** the game — NC would be acceptable, but **still prefer CC0** for SFX simplicity. |

### Related: Wave music intent (not SFX — track in `08` when authoring)

Owner direction for the **Wave** window bed (separate from this SFX brief):

- Primary playlist: **high-pace techno** / energetic instrumental → `content/wave/high/`
- Slower / duller options for Recovery-adjacent / throw-off moments → `content/wave/boring/`
- Always played through **Wave** (and mix buses), never a global unrelated BGM layer
- Same independence rule: local files in the pack, not a streaming API

SFX one-shots stay pleasant empowering ticks (iOS-*like* pleasure); Wave carries the techno bed. Game Over is the drained exception.

## Mix buses (implement later — author against these)

Priority order from `09` (highest first):

1. Critical Alerts / Burnout telegraph / Game Over sting  
2. Focus Chain / big arcade rewards  
3. Combo SFX (boredom curve)  
4. Minigame action SFX  
5. Wave music bed *(media pack — not this brief)*  
6. Echo playback *(media pack — not this brief)*  
7. Ambient UI  

| Bus id | Feeds | Notes |
| --- | --- | --- |
| `bus_critical` | critical alerts, burnout telegraph, game over sting | Can duck everything briefly |
| `bus_reward` | focus chain, big stickers | |
| `bus_combo` | combo juicy / bored | Boredom = alternate clips and/or param automation |
| `bus_minigame` | lane / runner / blocks SFX | |
| `bus_alert` | normal / high alerts (non-critical) | |
| `bus_ui` | PLAY click, toggle, modal, soft ticks | Lowest SFX tier |
| `bus_wave` / `bus_echo` | media elements | Muffled when not Active Window (except Burnout) |

Accessibility Mode (`09`): reduce motion first. **SFX policy (locked):** keep informational SFX; soften critical peaks about **−6 dB**; do not remove cue meaning; **no separate soft files** unless playtest demands them later; do not mute `bus_ui` by default.

---

## Format & delivery rules

| Rule | Value |
| --- | --- |
| Container | **`.ogg`** (Vorbis or Opus inside Ogg) — matches `09` |
| Channels | Mono preferred for one-shots; stereo OK for stingers ≤ 2 s |
| Length | One-shots typically 80–600 ms; stingers ≤ 1.5 s; telegraph loopable ≤ 2 s |
| Peak | Leave ~−1 dBFS headroom; final loudness matched in mixer, not by crushing each file |
| Naming | Exact filenames in the cue tables below |
| Credits | Every third-party clip needs `license` + `attribution` in `content/sfx/manifest.json` (`13`) |
| Placeholders | Do **not** commit silent/fake binaries as “final”. Empty path + manifest `status: missing` is fine until real audio lands |

---

## Cue sheet — shared / feel

Path root: `content/minigames/_shared/`

| Cue id | File | Trigger | Bus | Mood / notes |
| --- | --- | --- | --- | --- |
| `sfx_combo_juicy` | `sfx_sticker_combo_juicy.ogg` | Combo sticker pop (early / high juice) | `bus_combo` | Bright arcade tick-up |
| `sfx_combo_bored` | `sfx_sticker_combo_bored.ogg` | Combo under diminishing returns | `bus_combo` | Flatter, shorter cousin of juicy |
| `sfx_chain_step` | `sfx_sticker_chain_step.ogg` | Focus Chain increments | `bus_reward` | Rising step; readable under chaos |
| `sfx_chain_complete` | `sfx_sticker_chain_complete.ogg` | Chain tier / milestone | `bus_reward` | Bigger than step; not Game Over loud |
| `sfx_burnout_telegraph` | `sfx_sticker_burnout_telegraph.ogg` | APM approaching Burnout | `bus_critical` | Loopable pulse/tension; Accessibility softens via mix (−6 dB), not a second file |

---

## Cue sheet — Lane Defender

Path root: `content/minigames/lane_defender/`

| Cue id | File | Trigger | Bus |
| --- | --- | --- | --- |
| `sfx_ld_hit` | `sfx_hit.ogg` | Shot / melee connects | `bus_minigame` |
| `sfx_ld_destroy` | `sfx_destroy.ogg` | Enemy down | `bus_minigame` |
| `sfx_ld_boss_warn` | `sfx_boss_warn.ogg` | Boss telegraph | `bus_minigame` |
| `sfx_ld_boss_down` | `sfx_boss_down.ogg` | Boss defeated | `bus_reward` |
| `sfx_ld_pickup` | `sfx_pickup.ogg` | Powerup collect | `bus_minigame` |

---

## Cue sheet — Endless Runner

Path root: `content/minigames/endless_runner/`

| Cue id | File | Trigger | Bus |
| --- | --- | --- | --- |
| `sfx_er_lane` | `sfx_lane.ogg` | Lane change | `bus_minigame` |
| `sfx_er_collect` | `sfx_collect.ogg` | Collectible | `bus_minigame` |
| `sfx_er_crash` | `sfx_crash.ogg` | Hit obstacle | `bus_minigame` |
| `sfx_er_rare` | `sfx_rare.ogg` | Rare pickup | `bus_reward` |

---

## Cue sheet — Block Cascade

Path root: `content/minigames/block_cascade/`

| Cue id | File | Trigger | Bus |
| --- | --- | --- | --- |
| `sfx_bc_place` | `sfx_place.ogg` | Piece locks | `bus_minigame` |
| `sfx_bc_rotate` | `sfx_rotate.ogg` | Rotate | `bus_minigame` |
| `sfx_bc_clear` | `sfx_clear.ogg` | Line clear | `bus_minigame` |
| `sfx_bc_tetris` | `sfx_tetris.ogg` | Multi-line / “tetris” clear | `bus_reward` |
| `sfx_bc_reset` | `sfx_reset.ogg` | Board / piece reset beat | `bus_minigame` |

---

## Cue sheet — hub / UI / Alerts (locked — include)

`09` listed minigame/shared SFX paths in detail but not every Start Page / Alert click. This set fills that gap so the hub and notifications aren’t silent.

**In plain terms:** tiny sounds for buttons (PLAY, Credits open/close, accessibility toggle), four urgency levels when an Alert pops, plus “you entered Burnout / Recovery / Game Over.”

**Locked:** ship all **Yes** rows. **Optional** rows may wait until polish. Pulse/Wave/Echo micro-clicks (like, skip, scrub, etc.) are **in scope for production after #8** — every meaningful action should have a pleasant empowering tick (add cues to the manifest then; don’t leave windows silent).

Path root: `content/sfx/ui/` and `content/sfx/alerts/`

| Cue id | File | Trigger | Bus | Include? |
| --- | --- | --- | --- | --- |
| `sfx_ui_play` | `content/sfx/ui/play.ogg` | PLAY / PLAY AGAIN confirm | `bus_ui` | Yes |
| `sfx_ui_toggle` | `content/sfx/ui/toggle.ogg` | Accessibility toggle | `bus_ui` | Yes |
| `sfx_ui_modal_open` | `content/sfx/ui/modal_open.ogg` | Credits Modal open | `bus_ui` | Yes |
| `sfx_ui_modal_close` | `content/sfx/ui/modal_close.ogg` | Credits Modal close | `bus_ui` | Yes |
| `sfx_ui_soft_tick` | `content/sfx/ui/soft_tick.ogg` | Score float / minor UI | `bus_ui` | Optional |
| `sfx_alert_soft` | `content/sfx/alerts/soft.ogg` | Low-priority / spam-ish alert appear | `bus_alert` | Yes |
| `sfx_alert_normal` | `content/sfx/alerts/normal.ogg` | Normal alert | `bus_alert` | Yes |
| `sfx_alert_high` | `content/sfx/alerts/high.ogg` | High / social / media attention | `bus_alert` | Yes |
| `sfx_alert_critical` | `content/sfx/alerts/critical.ogg` | Critical / fake-system urgent | `bus_critical` | Yes |
| `sfx_alert_dismiss` | `content/sfx/alerts/dismiss.ogg` | Dismiss | `bus_ui` | Optional |
| `sfx_game_over_sting` | `content/sfx/ui/game_over_sting.ogg` | Enter Game Over → then silence | `bus_critical` | Yes — **boring/drained**, not epic |
| `sfx_burnout_enter` | `content/sfx/ui/burnout_enter.ogg` | Enter Burnout | `bus_critical` | Yes |
| `sfx_recovery_enter` | `content/sfx/ui/recovery_enter.ogg` | Enter Recovery | `bus_ui` | Yes |

---

## Manifest

Ship a machine-readable inventory:

```
content/sfx/manifest.json
```

Shape (conceptual):

```json
{
  "version": 1,
  "cues": [
    {
      "id": "sfx_combo_juicy",
      "path": "content/minigames/_shared/sfx_sticker_combo_juicy.ogg",
      "bus": "bus_combo",
      "status": "missing",
      "license": null,
      "attribution": null
    }
  ]
}
```

`status`: `missing` | `placeholder` | `final`. Credits UI reads non-null license/attribution for third-party clips (`13`).

---

## Production phases

| Phase | What | Blocks coding? |
| ---: | --- | --- |
| **S0** | This brief + empty drop zones + `manifest.json` with `missing` cues | No — unblocks planning |
| **S1** | Shared sticker + burnout telegraph + game over / burnout / recovery stings | Nice before feel polish |
| **S2** | All three minigame packs | Needed for minigame juice |
| **S3** | Alert tier set + hub UI clicks | Needed for Alerts / Start Page feel |
| **S4** | Loudness pass (no separate Accessibility soft files unless playtest demands) | Polish |

Wave `high`/`boring` tracks and Echo beds = **separate media pass** (`08`), not S0–S4. Start after visuals #8 if desired; owner wants **high-pace techno** in `high/`, slower options in `boring/`.

---

## Out of scope

- Wave music beds / Echo long-form audio-video catalogs  
- Loop clip audio (video carries its own)  
- Implementing the Web Audio mixer (TDD / `10`)  
- Real-platform notification sound clones  
- Committing copyrighted packs without license rows in the manifest  

---

## Owner decisions (locked 2026-09-20)

| # | Topic | Decision |
| ---: | --- | --- |
| 1 | Source | **Generative first** (local `.ogg` in repo, no stream/API). **Freesound** for gaps. |
| 2 | Licenses | SFX prefer **CC0** (confirmed). Content packs use **per-item** licenses. Game will not be sold; NC OK but unused for SFX. |
| 3 | Refs / Wave / feel | Pleasant empowering SFX (iOS-*like* pleasure, not Apple samples). Wave: **high-pace techno** + slower `boring/`. |
| 4 | Accessibility | Soften critical peaks ~−6 dB; keep informational SFX; no soft-file split unless needed later. |
| 5 | Action coverage | **Yes** hub/alert rows + later **pleasant micro-SFX on every meaningful action** (Pulse/Wave/Echo/minigame) — empower, never annoy. |
| 6 | Game Over | Short **boring/drained** cue → hard silence (no power, no energy). |
| 7 | Timing | **Produce `.ogg` after visual PR #8**; likely Claude for generation/export. |

S0 (this brief + missing manifest) is done. Do not invent final `.ogg` bytes until after #8 unless the owner says otherwise.

---

## Acceptance checklist

- [x] Owner decisions locked (table above)  
- [x] `content/sfx/manifest.json` lists every cue in this brief  
- [x] Drop zones exist (`content/sfx/ui/`, `content/sfx/alerts/`; minigame folders already present)  
- [ ] Each `final` cue is `.ogg`, named exactly, credited if third-party  
- [ ] No real-platform notif / jingle clones  
- [ ] Mix priority and buses match `09` / `10`  

---

## Suggested next agent prompt (after #8)

```
Produce Dopamine SFX from @defs/15_sfx_audio.md (owner decisions locked).
Prefer generative local .ogg (no streaming API); Freesound/CC0 for gaps.
Fill content/sfx/manifest.json statuses; credit any third-party rows.
Do not touch visual paths. Do not scaffold the Vite app unless asked.
Update HANDOFF when a batch of cues lands.
```
