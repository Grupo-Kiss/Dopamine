import { n, rng } from './brand.mjs';

/** Violet-bloom + animated-grid stage. Matches the Phase A/C defs exactly. */
export function stageDefs(w, h) {
  return `
<pattern id="st-grid" width="46" height="46" patternUnits="userSpaceOnUse">
  <path d="M46 0 V46 M0 46 H46" fill="none" stroke="#8ea4c4" stroke-width="1" stroke-opacity="0.085"/>
</pattern>
<pattern id="st-grid-hot" width="46" height="46" patternUnits="userSpaceOnUse">
  <path d="M46 0 V46 M0 46 H46" fill="none" stroke="#a371f7" stroke-width="1.35"/>
</pattern>
<radialGradient id="st-bloomA" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#c060ff" stop-opacity="0.66"/>
  <stop offset="0.35" stop-color="#6e40c9" stop-opacity="0.34"/>
  <stop offset="0.68" stop-color="#3a1a6e" stop-opacity="0.12"/>
  <stop offset="1" stop-color="#1a0e33" stop-opacity="0"/>
</radialGradient>
<radialGradient id="st-bloomB" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#ff4fd8" stop-opacity="0.5"/>
  <stop offset="0.4" stop-color="#c9399b" stop-opacity="0.22"/>
  <stop offset="1" stop-color="#3d0a33" stop-opacity="0"/>
</radialGradient>
<radialGradient id="st-bloomC" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#5f7bff" stop-opacity="0.34"/>
  <stop offset="0.45" stop-color="#3b3fa8" stop-opacity="0.15"/>
  <stop offset="1" stop-color="#101a3a" stop-opacity="0"/>
</radialGradient>
<radialGradient id="st-bloomD" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#ff2d6f" stop-opacity="0.34"/>
  <stop offset="0.45" stop-color="#8f1440" stop-opacity="0.14"/>
  <stop offset="1" stop-color="#3d0a1f" stop-opacity="0"/>
</radialGradient>
<radialGradient id="st-core" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.2"/>
  <stop offset="0.16" stop-color="#e6b6ff" stop-opacity="0.15"/>
  <stop offset="0.45" stop-color="#a371f7" stop-opacity="0.10"/>
  <stop offset="1" stop-color="#6e40c9" stop-opacity="0"/>
</radialGradient>
<radialGradient id="st-ring0" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0.6" stop-color="#a371f7" stop-opacity="0"/>
  <stop offset="0.82" stop-color="#a371f7" stop-opacity="0.16"/>
  <stop offset="0.93" stop-color="#d9b3ff" stop-opacity="0.09"/>
  <stop offset="1" stop-color="#6e40c9" stop-opacity="0"/>
</radialGradient>
<radialGradient id="st-ring1" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0.66" stop-color="#c9399b" stop-opacity="0"/>
  <stop offset="0.86" stop-color="#ff6fe0" stop-opacity="0.12"/>
  <stop offset="1" stop-color="#c9399b" stop-opacity="0"/>
</radialGradient>
<radialGradient id="st-gridglow" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#fff" stop-opacity="0.5"/>
  <stop offset="0.5" stop-color="#fff" stop-opacity="0.16"/>
  <stop offset="1" stop-color="#fff" stop-opacity="0"/>
</radialGradient>
<mask id="st-gridmask" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#000"/>
  <ellipse cx="${n(w / 2)}" cy="${n(h * 0.46)}" rx="${n(w * 0.42)}" ry="${n(h * 0.4)}" fill="url(#st-gridglow)"/>
  <ellipse cx="${n(w * 0.17)}" cy="${n(h * 0.74)}" rx="${n(w * 0.17)}" ry="${n(h * 0.2)}" fill="url(#st-gridglow)" opacity="0.6"/>
  <ellipse cx="${n(w * 0.86)}" cy="${n(h * 0.24)}" rx="${n(w * 0.15)}" ry="${n(h * 0.18)}" fill="url(#st-gridglow)" opacity="0.55"/>
</mask>
<linearGradient id="st-floor" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0d1117"/>
  <stop offset="0.55" stop-color="#0b0e14"/>
  <stop offset="1" stop-color="#07090d"/>
</linearGradient>
<linearGradient id="st-streak" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#a371f7" stop-opacity="0"/>
  <stop offset="0.5" stop-color="#e9d5ff" stop-opacity="1"/>
  <stop offset="1" stop-color="#c9399b" stop-opacity="0"/>
</linearGradient>`;
}

export function stageBack(w, h, { seed = 7, streaks = 9, bloom = 0.52 } = {}) {
  const cx = w / 2;
  const cy = h * 0.42;
  const r = rng(seed);
  let st = '';
  for (let i = 0; i < streaks; i++) {
    const sx = r() * w * 0.9;
    const sy = h * 0.12 + r() * h * 0.72;
    const len = w * (0.035 + r() * 0.08);
    const rot = (r() - 0.5) * 60;
    st += `<rect x="${n(sx)}" y="${n(sy)}" width="${n(len)}" height="${n(0.9 + r() * 1.4)}" rx="1" transform="rotate(${n(rot)} ${n(sx)} ${n(sy)})" fill="url(#st-streak)" opacity="${n(0.22 + r() * 0.3)}"/>`;
  }
  let rings = '';
  for (let i = 0; i < 4; i++) {
    rings += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(w * 0.1853 + i * w * 0.1606)}" ry="${n(h * 0.3 + i * h * 0.26)}" fill="url(#st-ring${i % 2})" opacity="${[0.28, 0.23, 0.18, 0.13][i]}"/>`;
  }
  return `
<rect width="${w}" height="${h}" fill="url(#st-floor)"/>
<g opacity="${bloom}">
  <ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(w * 0.54)}" ry="${n(h * 0.7)}" fill="url(#st-bloomA)"/>
  <ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(w * 0.3)}" ry="${n(h * 0.4)}" fill="url(#st-bloomB)" opacity="0.85"/>
  <ellipse cx="${n(w * 0.04)}" cy="${n(h * 0.22)}" rx="${n(w * 0.24)}" ry="${n(h * 0.34)}" fill="url(#st-bloomB)" opacity="0.82"/>
  <ellipse cx="${n(w * 0.98)}" cy="${n(h * 0.86)}" rx="${n(w * 0.24)}" ry="${n(h * 0.34)}" fill="url(#st-bloomB)" opacity="0.7"/>
  <ellipse cx="${n(w * 0.02)}" cy="${n(h * 0.82)}" rx="${n(w * 0.17)}" ry="${n(h * 0.26)}" fill="url(#st-bloomD)" opacity="0.7"/>
  <ellipse cx="${n(w * 0.86)}" cy="${n(h * 0.04)}" rx="${n(w * 0.24)}" ry="${n(h * 0.26)}" fill="url(#st-bloomC)" opacity="0.7"/>
  <ellipse cx="${n(w * 0.06)}" cy="${n(h)}" rx="${n(w * 0.22)}" ry="${n(h * 0.24)}" fill="url(#st-bloomC)" opacity="0.6"/>
</g>
<g mask="url(#st-gridmask)">
  <rect width="${w}" height="${h}" fill="url(#st-grid)"/>
  <rect width="${w}" height="${h}" fill="url(#st-grid-hot)" opacity="0.38"/>
</g>
<g>${rings}</g>
<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(Math.min(w, h) * 0.5)}" ry="${n(Math.min(w, h) * 0.5)}" fill="url(#st-core)" opacity="0.55"/>
${st}`;
}

export function crtDefs() {
  return `
<pattern id="crt-scan" width="4" height="3" patternUnits="userSpaceOnUse">
  <rect width="4" height="1.5" fill="#000" opacity="0.1"/>
</pattern>
<pattern id="crt-aperture" width="3" height="3" patternUnits="userSpaceOnUse">
  <rect width="1" height="3" fill="#ff2d2d" opacity="0.045"/>
  <rect x="1" width="1" height="3" fill="#2dff7a" opacity="0.035"/>
  <rect x="2" width="1" height="3" fill="#2d6cff" opacity="0.045"/>
</pattern>
<radialGradient id="crt-vig" cx="0.5" cy="0.48" r="0.72">
  <stop offset="0" stop-color="#000" stop-opacity="0"/>
  <stop offset="0.55" stop-color="#000" stop-opacity="0.06"/>
  <stop offset="0.8" stop-color="#000" stop-opacity="0.35"/>
  <stop offset="1" stop-color="#000" stop-opacity="0.82"/>
</radialGradient>
<radialGradient id="crt-glass" cx="0.28" cy="0.16" r="0.62">
  <stop offset="0" stop-color="#cfe4ff" stop-opacity="0.075"/>
  <stop offset="0.45" stop-color="#cfe4ff" stop-opacity="0.022"/>
  <stop offset="1" stop-color="#cfe4ff" stop-opacity="0"/>
</radialGradient>
<filter id="crt-noise" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="9" stitchTiles="stitch" result="n"/>
  <feColorMatrix type="saturate" values="0" in="n" result="g"/>
  <feComponentTransfer in="g" result="c">
    <feFuncA type="linear" slope="0.045" intercept="0"/>
  </feComponentTransfer>
</filter>`;
}

export function crtOverlay(w, h) {
  return `
<g style="mix-blend-mode:normal">
  <rect width="${w}" height="${h}" filter="url(#crt-noise)"/>
  <rect width="${w}" height="${h}" fill="url(#crt-scan)"/>
  <rect width="${w}" height="${h}" fill="url(#crt-aperture)"/>
  <rect width="${w}" height="${h}" fill="url(#crt-glass)"/>
  <rect width="${w}" height="${h}" fill="url(#crt-vig)"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="15" fill="none" stroke="#000" stroke-width="1.5" stroke-opacity="0.5"/>
</g>`;
}
