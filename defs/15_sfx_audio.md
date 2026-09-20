# SFX & Short Audio Production Brief

## Purpose

**Single source of truth for the short-audio pass** (UI / arcade / minigame / alert SFX). Complements the mix rules in `09_game_feel.md` and the Web Audio buses in `10_tech.md`.

This is **not** the Wave music catalog or Echo long-form beds — those stay in `08_content.md` (media packs / optional Jamendo).

**Visual PR #8 does not own this.** Drop `.ogg` files at the paths below when produced; until then the cue list + placeholders are enough for later TDD fakes.

Feel language / mix priority: `09`. Credits / licenses: `13`. Handoff status: `HANDOFF.md`.

---

## Audio personality (locked direction — confirm refs)

| Axis | Direction |
| --- | --- |
| Overall | Arcade-first satire — punchy, readable, slightly over-the-top. Same energy refs as shell: Broforce / Kung Fury / Metal Slug / Mortal Kombat **punch**, not cute/childish chimes |
| Combo juicy → bored | Early hits bright/satisfying; same-window repeats flatten (duller, shorter, less stereo sparkle) while still readable |
| Alerts | Distinct from minigame hits; OS-notif parody without copying iOS/Android/Windows sounds |
| Burnout telegraph | Rising tension, not a jump-scare scream |
| Game Over | Short sting → **hard silence** (graph suspend) |
| Legal | No recognisable commercial jingles, platform notif sounds, or meme audio that implies endorsement |

**Owner input needed:** additional audio references (games / pack / artist), and whether generative SFX are allowed.

---

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

Accessibility Mode (`09`): reduce motion first; **SFX policy is an owner decision** (see bottom) — default proposal: keep informational SFX, soften critical peaks −6 dB, no removal of cue meaning.

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
| `sfx_burnout_telegraph` | `sfx_sticker_burnout_telegraph.ogg` | APM approaching Burnout | `bus_critical` | Loopable pulse/tension; Accessibility: prefer softer variant if we split later |

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

## Cue sheet — hub / UI / Alerts (needed for TDD; not fully named in `09` tables)

These are **proposed additions** so Loading → Playing → Alerts have sound without inventing files in code. **Owner: approve or cut.**

Path root: `content/sfx/ui/` and `content/sfx/alerts/`

| Cue id | File | Trigger | Bus | Default include? |
| --- | --- | --- | --- | --- |
| `sfx_ui_play` | `content/sfx/ui/play.ogg` | PLAY / PLAY AGAIN confirm | `bus_ui` | Yes |
| `sfx_ui_toggle` | `content/sfx/ui/toggle.ogg` | Accessibility toggle | `bus_ui` | Yes |
| `sfx_ui_modal_open` | `content/sfx/ui/modal_open.ogg` | Credits Modal open | `bus_ui` | Yes |
| `sfx_ui_modal_close` | `content/sfx/ui/modal_close.ogg` | Credits Modal close | `bus_ui` | Yes |
| `sfx_ui_soft_tick` | `content/sfx/ui/soft_tick.ogg` | Optional score float / minor UI | `bus_ui` | Optional |
| `sfx_alert_soft` | `content/sfx/alerts/soft.ogg` | Low-priority / spam-ish alert appear | `bus_alert` | Yes |
| `sfx_alert_normal` | `content/sfx/alerts/normal.ogg` | Normal alert | `bus_alert` | Yes |
| `sfx_alert_high` | `content/sfx/alerts/high.ogg` | High / social / media attention | `bus_alert` | Yes |
| `sfx_alert_critical` | `content/sfx/alerts/critical.ogg` | Critical / fake-system urgent | `bus_critical` | Yes |
| `sfx_alert_dismiss` | `content/sfx/alerts/dismiss.ogg` | Dismiss | `bus_ui` | Optional |
| `sfx_game_over_sting` | `content/sfx/ui/game_over_sting.ogg` | Enter Game Over → then silence | `bus_critical` | Yes |
| `sfx_burnout_enter` | `content/sfx/ui/burnout_enter.ogg` | Enter Burnout | `bus_critical` | Yes |
| `sfx_recovery_enter` | `content/sfx/ui/recovery_enter.ogg` | Enter Recovery | `bus_ui` | Yes |

Pulse / Wave / Echo **interaction** micro-SFX (like, skip, scrub) can wait until window TDD; not blocking this brief.

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
| **S4** | Loudness pass + Accessibility soft variants (if owner wants separate files) | Polish |

Wave `high`/`boring` tracks and Echo beds = **separate media pass** (`08`), not S0–S4.

---

## Out of scope

- Wave music beds / Echo long-form audio-video catalogs  
- Loop clip audio (video carries its own)  
- Implementing the Web Audio mixer (TDD / `10`)  
- Real-platform notification sound clones  
- Committing copyrighted packs without license rows in the manifest  

---

## Owner input needed (blockers for production, not for this brief)

Answer these when you can — agents can keep scaffolding manifests without them:

1. **Who makes the sounds?**  
   - You / a friend · commission · Freesound (per-clip CC) · licensed pack · generative tool · mix of these?

2. **License bar for shipping**  
   - CC0 / public domain only?  
   - Attribution-required OK (must flow into Credits Modal)?  
   - NC (non-commercial) OK for itch prototypes but not later commercial?

3. **Audio references**  
   - Any specific games, packs, or “sounds like X” beyond Broforce / Kung Fury / Metal Slug / MK punch?

4. **Accessibility Mode + SFX**  
   - Soften peaks only (proposed default)?  
   - Mute `bus_ui`?  
   - Separate “soft” files for telegraph / critical?

5. **Approve proposed hub/alert cue list?**  
   - Keep all · cut optionals · add Pulse/Wave micro-interactions now?

6. **Game Over**  
   - Confirm: short sting → hard silence (as `09`)? Any longer sting?

7. **Timing**  
   - Produce SFX in parallel with visuals, or wait until after #8 acceptance / during TDD?

Until you answer, this brief + `missing` manifest rows are the SSOT; no agent should invent “final” `.ogg` bytes.

---

## Acceptance checklist

- [ ] Owner answered the input block above (at least 1–2, 4–5)  
- [ ] `content/sfx/manifest.json` lists every cue in this brief  
- [ ] Drop zones exist (`_shared/`, each minigame folder, `content/sfx/ui/`, `content/sfx/alerts/`)  
- [ ] Each `final` cue is `.ogg`, named exactly, credited if third-party  
- [ ] No real-platform notif / jingle clones  
- [ ] Mix priority and buses match `09` / `10`  

---

## Suggested next agent prompt

```
Continue Dopamine audio from @defs/15_sfx_audio.md and @HANDOFF.md.
Respect owner answers in the Owner input section (or ask if still open).
Do not touch visual paths owned by PR #8. Do not scaffold the Vite app.
Update content/sfx/manifest.json and HANDOFF when cues land.
```
