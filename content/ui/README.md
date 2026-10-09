# Shared UI kit

Production chrome and controls for every surface. Built during **Phase A** of `defs/14_visual_assets.md`; window-specific skins live in `windows/`, stickers in `stickers/`, state overlays in `overlays/`.

| File | What |
| --- | --- |
| `os_window_frame.svg` | Resting OS window: title bar, traffic-light dots, body. Panel `#161b22`, edge `#30363d`, ~14px radius |
| `os_window_frame_active.svg` | Active Window: stronger stroke + violet outer glow |
| `crt_overlay_preview.webp` | Reference for the full-screen CRT glass (scanlines, aperture grille, convex glass, barrel vignette, lo-fi noise) |
| `stage_grid_bloom_preview.webp` | Reference for the stage layer alone: animated grid + violet blooms |
| `play_button.svg` | Beveled metal-framed PLAY CTA |
| `play_again_button.svg` | Same language, hungry `PLAY AGAIN` state |
| `accessibility_toggle.svg` | Low-contrast corner control, off / on |
| `credits_link.svg` | Quiet text-link treatment, rest / hover |

## Rules carried from `DESIGN.md`

- The CRT is a **full-screen top layer**. Never stamp scanlines onto PLAY or any other control.
- Grid atmosphere only — no connecting track lines or concentric ring diagrams.
- Accessibility Mode is reduced motion. It is not a light theme.
