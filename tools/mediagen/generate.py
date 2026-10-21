#!/usr/bin/env python3
"""Populate Loop / Wave / Echo drop zones with first-party generative media (E24)."""

from __future__ import annotations

import json
import math
import struct
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RATE = 44100


def run_ffmpeg(args: list[str]) -> None:
    subprocess.run(["ffmpeg", "-y", *args], check=True, capture_output=True)


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


def synth_bed(dur: float, bpm: float, base_hz: float, bright: bool) -> list[float]:
    n = int(dur * RATE)
    beat = 60.0 / bpm
    out = [0.0] * n
    for i in range(n):
        t = i / RATE
        # Kick on beat
        kick_phase = (t % beat) / beat
        kick = math.exp(-kick_phase * 18) * math.sin(2 * math.pi * 55 * t) if bright else 0.0
        # Soft pad / bass
        pad = 0.18 * math.sin(2 * math.pi * base_hz * t)
        if bright:
            pad += 0.08 * math.sin(2 * math.pi * base_hz * 2 * t)
            hat = 0.05 * ((1 if (t % (beat / 2)) < 0.03 else 0))
        else:
            hat = 0.0
            pad *= 0.6
        # Gentle fade edges
        edge = 1.0
        fade = 0.4
        if t < fade:
            edge = t / fade
        if t > dur - fade:
            edge = max(0.0, (dur - t) / fade)
        out[i] = edge * (kick * 0.55 + pad + hat)
    return out


def wav_to_mp3(wav: Path, mp3: Path) -> None:
    mp3.parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg(["-i", str(wav), "-codec:a", "libmp3lame", "-q:a", "4", str(mp3)])


def still_to_webm(image: Path, webm: Path, seconds: float = 2.0) -> None:
    webm.parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg(
        [
            "-loop",
            "1",
            "-i",
            str(image),
            "-t",
            str(seconds),
            "-c:v",
            "libvpx",
            "-pix_fmt",
            "yuv420p",
            "-an",
            str(webm),
        ]
    )


def color_webm(webm: Path, color: str, seconds: float = 2.0) -> None:
    webm.parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg(
        [
            "-f",
            "lavfi",
            "-i",
            f"color=c={color}:s=720x1280:d={seconds}",
            "-c:v",
            "libvpx",
            "-pix_fmt",
            "yuv420p",
            "-an",
            str(webm),
        ]
    )


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)

        # --- Loop: 6 short clips (starter 5 + expanded) ---
        loop_clips = []
        placeholders = sorted((ROOT / "content/loop/placeholders").glob("clip_*.webp"))
        for index, image in enumerate(placeholders, start=1):
            rel = f"clips/clip_{index:02d}.webm"
            still_to_webm(image, ROOT / "content/loop" / rel, seconds=2.0 + index * 0.15)
            loop_clips.append(
                {
                    "id": f"loop_{index:03d}",
                    "path": rel,
                    "title": f"Scroll Ritual {index}",
                    "creatorLabel": "Dopamine procedural desk",
                    "tags": ["brainrot", "owned"],
                    "license": "owned",
                    "attribution": "",
                }
            )

        # Extra generative color clips to expand beyond starter.
        extras = [
            ("loop_004", "clips/clip_04.webm", "0x2a1a3a", "Infinite Stare Buffer"),
            ("loop_005", "clips/clip_05.webm", "0x1a2a2a", "Definitely Not A Trend"),
            ("loop_006", "clips/clip_06.webm", "0x3a2018", "Swipe Gravity Well"),
        ]
        for cue_id, rel, color, title in extras:
            color_webm(ROOT / "content/loop" / rel, color, seconds=2.2)
            loop_clips.append(
                {
                    "id": cue_id,
                    "path": rel,
                    "title": title,
                    "creatorLabel": "Dopamine procedural desk",
                    "tags": ["brainrot", "owned"],
                    "license": "owned",
                    "attribution": "",
                }
            )

        (ROOT / "content/loop/manifest.json").write_text(
            json.dumps({"version": 1, "clips": loop_clips}, indent=2) + "\n"
        )

        # --- Wave: 2 high + 1 boring (starter) + 1 extra high for expanded ---
        wave_tracks = []
        beds = [
            ("wave_high_001", "high/corridor_pulse.mp3", "Corridor Pulse", 132, 110.0, True, "CC0", "Null Festival — CC0"),
            ("wave_high_002", "high/feed_accelerator.mp3", "Feed Accelerator", 140, 98.0, True, "CC0", "Null Festival — CC0"),
            ("wave_boring_001", "boring/hold_music_forever.mp3", "Hold Music Forever", 72, 130.0, False, "owned", ""),
            ("wave_high_003", "high/notification_overdrive.mp3", "Notification Overdrive", 148, 90.0, True, "CC0", "Null Festival — CC0"),
        ]
        for track_id, rel, title, bpm, base, bright, license_name, attribution in beds:
            samples = synth_bed(8.0 if bright else 10.0, bpm, base, bright)
            wav = tmp_path / f"{track_id}.wav"
            write_wav(wav, samples)
            out = ROOT / "content/wave" / rel
            wav_to_mp3(wav, out)
            pace = "high" if bright else "boring"
            entry = {
                "id": track_id,
                "path": rel,
                "title": title,
                "artistLabel": "Null Festival" if license_name == "CC0" else "Waiting Room",
                "pace": pace,
                "license": license_name,
                "attribution": attribution,
            }
            wave_tracks.append(entry)

        (ROOT / "content/wave/manifest.json").write_text(
            json.dumps(
                {
                    "version": 1,
                    "tracks": wave_tracks,
                    "notes": "Folder high/ => pace high; boring/ => pace boring. Owner intent: high = techno; boring = slower/Recovery-adjacent (defs/15).",
                },
                indent=2,
            )
            + "\n"
        )

        # --- Echo: 1 long audio + 1 short video (expanded beyond starter 1) ---
        echo_items = []
        # Long-form audio bed (~45s)
        audio_samples = synth_bed(45.0, 88, 120.0, False)
        # Soft spoken-word-ish beeps every ~8s as "moments"
        for mark in (8, 20, 33):
            start = int(mark * RATE)
            for i in range(int(0.2 * RATE)):
                idx = start + i
                if idx < len(audio_samples):
                    audio_samples[idx] += 0.2 * math.sin(2 * math.pi * 660 * i / RATE)
        wav = tmp_path / "echo_audio.wav"
        write_wav(wav, audio_samples)
        audio_rel = "audio/three_hours_on_nothing.mp3"
        wav_to_mp3(wav, ROOT / "content/echo" / audio_rel)
        echo_items.append(
            {
                "id": "echo_a_001",
                "kind": "audio",
                "path": audio_rel,
                "title": "Three Hours On Nothing",
                "creatorLabel": "Deep Dive Fiction",
                "license": "owned",
                "attribution": "",
                "moments": [
                    {"atSec": 8, "label": "hot take cold open"},
                    {"atSec": 20, "label": "controversial take"},
                    {"atSec": 33, "label": "apology tour preview"},
                ],
            }
        )

        video_rel = "video/edited_too_long.webm"
        color_webm(ROOT / "content/echo" / video_rel, "0x102030", seconds=4.0)
        echo_items.append(
            {
                "id": "echo_v_001",
                "kind": "video",
                "path": video_rel,
                "title": "I Edited This For Too Long",
                "creatorLabel": "Longform Larry",
                "license": "CC0",
                "attribution": "Longform Larry — CC0",
                "moments": [{"atSec": 2, "label": "thumbnail bait"}],
            }
        )

        (ROOT / "content/echo/manifest.json").write_text(
            json.dumps({"version": 1, "items": echo_items}, indent=2) + "\n"
        )

    print("Loop/Wave/Echo media packs generated.")


if __name__ == "__main__":
    main()
