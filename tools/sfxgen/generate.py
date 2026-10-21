#!/usr/bin/env python3
"""Generative first-party SFX for Dopamine (defs/15) → mono Vorbis .ogg."""

from __future__ import annotations

import json
import math
import struct
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "content/sfx/manifest.json"
RATE = 44100


def write_wav(path: Path, samples: list[float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(RATE)
        frames = bytearray()
        for sample in samples:
            clamped = max(-1.0, min(1.0, sample))
            frames += struct.pack("<h", int(clamped * 32767))
        wf.writeframes(frames)


def to_ogg(wav_path: Path, ogg_path: Path) -> None:
    ogg_path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(wav_path),
            "-c:a",
            "libvorbis",
            "-q:a",
            "4",
            str(ogg_path),
        ],
        check=True,
        capture_output=True,
    )


def env(n: int, attack: float, release: float) -> list[float]:
    a = max(1, int(attack * RATE))
    r = max(1, int(release * RATE))
    out = [1.0] * n
    for i in range(min(a, n)):
        out[i] = i / max(a - 1, 1)
    for i in range(min(r, n)):
        idx = n - 1 - i
        out[idx] = min(out[idx], (r - 1 - i) / max(r - 1, 1))
    return out


def sine(freq: float, dur: float, amp: float = 0.5) -> list[float]:
    n = int(dur * RATE)
    e = env(n, 0.008, min(0.06, dur * 0.4))
    return [
        amp * e[i] * math.sin(2 * math.pi * freq * i / RATE) for i in range(n)
    ]


def concat(parts: list[list[float]]) -> list[float]:
    out: list[float] = []
    for part in parts:
        out.extend(part)
    return out


def mix(parts: list[list[float]], amp: float = 1.0) -> list[float]:
    n = max((len(p) for p in parts), default=0)
    out = [0.0] * n
    for part in parts:
        for i, sample in enumerate(part):
            out[i] += sample
    return [amp * sample for sample in out]


def noise_hit(dur: float, amp: float, lowpass_factor: float) -> list[float]:
    # Deterministic LCG pink-ish noise (no secrets / no network).
    n = int(dur * RATE)
    e = env(n, 0.005, dur * 0.55)
    state = 1
    raw = []
    for _ in range(n):
        state = (1103515245 * state + 12345) & 0x7FFFFFFF
        raw.append((state / 0x7FFFFFFF) * 2 - 1)
    # one-pole lowpass
    out = []
    y = 0.0
    alpha = lowpass_factor
    for i, x in enumerate(raw):
        y = y + alpha * (x - y)
        out.append(amp * e[i] * y)
    return out


def tremolo_sine(freq: float, dur: float, rate: float, depth: float, amp: float) -> list[float]:
    n = int(dur * RATE)
    e = env(n, 0.04, 0.1)
    out = []
    for i in range(n):
        t = i / RATE
        trem = 1.0 - depth * (0.5 + 0.5 * math.sin(2 * math.pi * rate * t))
        out.append(amp * e[i] * trem * math.sin(2 * math.pi * freq * t))
    return out


def drain_desc(freqs: list[float], step: float, amp: float) -> list[float]:
    parts = [sine(f, step, amp) for f in freqs]
    return concat(parts)


RECIPES: dict[str, callable] = {
    "sfx_combo_juicy": lambda: mix([sine(880, 0.18, 0.45), sine(1320, 0.18, 0.2)]),
    "sfx_combo_bored": lambda: sine(440, 0.1, 0.3),
    "sfx_chain_step": lambda: concat([sine(660, 0.07, 0.4), sine(880, 0.07, 0.4), sine(1100, 0.09, 0.4)]),
    "sfx_chain_complete": lambda: concat(
        [sine(523, 0.09, 0.4), sine(659, 0.09, 0.4), sine(784, 0.09, 0.4), sine(1046, 0.14, 0.45)]
    ),
    "sfx_burnout_telegraph": lambda: tremolo_sine(220, 1.2, 5.0, 0.55, 0.35),
    "sfx_ld_hit": lambda: noise_hit(0.12, 0.5, 0.25),
    "sfx_ld_destroy": lambda: noise_hit(0.28, 0.55, 0.15),
    "sfx_ld_boss_warn": lambda: tremolo_sine(180, 0.6, 8.0, 0.65, 0.4),
    "sfx_ld_boss_down": lambda: concat(
        [sine(392, 0.1, 0.4), sine(523, 0.1, 0.4), sine(659, 0.1, 0.4), sine(784, 0.18, 0.45)]
    ),
    "sfx_ld_pickup": lambda: concat([sine(988, 0.08, 0.4), sine(1318, 0.12, 0.4)]),
    "sfx_er_lane": lambda: sine(720, 0.08, 0.35),
    "sfx_er_collect": lambda: concat([sine(1046, 0.07, 0.4), sine(1396, 0.09, 0.4)]),
    "sfx_er_crash": lambda: noise_hit(0.35, 0.55, 0.12),
    "sfx_er_rare": lambda: concat(
        [sine(784, 0.1, 0.4), sine(988, 0.1, 0.4), sine(1174, 0.16, 0.45)]
    ),
    "sfx_bc_place": lambda: sine(260, 0.08, 0.35),
    "sfx_bc_rotate": lambda: concat([sine(420, 0.05, 0.35), sine(520, 0.05, 0.35)]),
    "sfx_bc_clear": lambda: concat([sine(523, 0.08, 0.4), sine(659, 0.08, 0.4), sine(784, 0.1, 0.4)]),
    "sfx_bc_tetris": lambda: concat(
        [
            sine(523, 0.08, 0.4),
            sine(659, 0.08, 0.4),
            sine(784, 0.08, 0.4),
            sine(1046, 0.08, 0.4),
            sine(1318, 0.14, 0.45),
        ]
    ),
    "sfx_bc_reset": lambda: noise_hit(0.25, 0.4, 0.18),
    "sfx_ui_play": lambda: concat([sine(587, 0.08, 0.4), sine(880, 0.12, 0.4)]),
    "sfx_ui_toggle": lambda: concat([sine(640, 0.05, 0.35), sine(800, 0.05, 0.35)]),
    "sfx_ui_modal_open": lambda: concat([sine(392, 0.08, 0.35), sine(523, 0.1, 0.35)]),
    "sfx_ui_modal_close": lambda: concat([sine(523, 0.07, 0.35), sine(392, 0.09, 0.35)]),
    "sfx_ui_soft_tick": lambda: sine(900, 0.06, 0.25),
    "sfx_alert_soft": lambda: sine(520, 0.2, 0.35),
    "sfx_alert_normal": lambda: concat([sine(560, 0.1, 0.4), sine(700, 0.14, 0.4)]),
    "sfx_alert_high": lambda: concat(
        [sine(640, 0.09, 0.4), sine(820, 0.09, 0.4), sine(980, 0.12, 0.4)]
    ),
    "sfx_alert_critical": lambda: tremolo_sine(480, 0.4, 9.0, 0.7, 0.45),
    "sfx_alert_dismiss": lambda: concat([sine(480, 0.06, 0.3), sine(360, 0.06, 0.3)]),
    "sfx_game_over_sting": lambda: drain_desc([196, 147, 110], 0.33, 0.25),
    "sfx_burnout_enter": lambda: tremolo_sine(160, 0.5, 7.0, 0.6, 0.4),
    "sfx_recovery_enter": lambda: concat(
        [sine(440, 0.1, 0.35), sine(554, 0.1, 0.35), sine(659, 0.15, 0.35)]
    ),
}


def main() -> None:
    manifest = json.loads(MANIFEST.read_text())
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        for cue in manifest["cues"]:
            cue_id = cue["id"]
            if cue_id not in RECIPES:
                raise SystemExit(f"No recipe for {cue_id}")
            samples = RECIPES[cue_id]()
            wav = tmp_path / f"{cue_id}.wav"
            ogg = ROOT / cue["path"]
            write_wav(wav, samples)
            to_ogg(wav, ogg)
            cue["status"] = "final"
            cue["license"] = "owned"
            cue["attribution"] = ""
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Generated {len(manifest['cues'])} cues → {MANIFEST}")


if __name__ == "__main__":
    main()
