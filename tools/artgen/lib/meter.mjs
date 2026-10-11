import { mix, n, rr } from './brand.mjs';

/**
 * Dopamine meter, built the same way as the Phase B3 sheet
 * (`content/mockups/dopamine_bar.svg`): shell, dark track, fill with a
 * two-pass bloom, vertical sheen, white meniscus cap, tick notches.
 *
 * The five rows are the B3 samples; any fill in between interpolates them so
 * hue and glow both follow the level continuously (`09`).
 */
const SAMPLES = [
  { t: 1.0, mid: '#ffa843', edge: '#9f663a', hi: '#ffc683', bloom: [20.93, 0.88, 53.32, 0.49], cap: 0.77 },
  { t: 0.72, mid: '#ec6a52', edge: '#944243', hi: '#f29d8d', bloom: [15.15, 0.65, 38.88, 0.35], cap: 0.59 },
  { t: 0.5, mid: '#b44594', edge: '#732d69', hi: '#ce84b8', bloom: [10.92, 0.49, 28.31, 0.24], cap: 0.45 },
  { t: 0.28, mid: '#8631b7', edge: '#59217d', hi: '#af77cf', bloom: [7.84, 0.37, 20.59, 0.17], cap: 0.36 },
  { t: 0.04, mid: '#642198', edge: '#45186b', hi: '#996cbb', bloom: [6.13, 0.31, 16.33, 0.12], cap: 0.3 },
];
/** Fill radius the B3 bloom deviations were authored against. */
const B3_RADIUS = 26;

export function meterTone(fill) {
  const f = Math.max(SAMPLES[SAMPLES.length - 1].t, Math.min(1, fill));
  let i = 0;
  while (i < SAMPLES.length - 2 && f < SAMPLES[i + 1].t) i++;
  const a = SAMPLES[i];
  const b = SAMPLES[i + 1];
  const k = (a.t - f) / (a.t - b.t);
  const lerp = (x, y) => x + (y - x) * k;
  return {
    mid: mix(a.mid, b.mid, k),
    edge: mix(a.edge, b.edge, k),
    hi: mix(a.hi, b.hi, k),
    bloom: a.bloom.map((v, j) => lerp(v, b.bloom[j])),
    cap: lerp(a.cap, b.cap),
  };
}

export function dopamineMeter({ id, x, y, w, h, fill, ticks = 9 }) {
  const tone = meterTone(fill);
  const r = w / 2;
  const pad = Math.max(1.5, w * 0.08);
  const fr = r - pad;
  const k = fr / B3_RADIUS;
  const [sdA, opA, sdB, opB] = tone.bloom;
  const trackTop = y + pad;
  const trackBot = y + h - pad;
  const top = trackBot - (trackBot - trackTop) * fill;
  const fillPath = rr(x + pad, top, w - pad * 2, trackBot - top, fr);

  const defs = `
<linearGradient id="${id}-shell" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#454e5a"/>
  <stop offset="0.5" stop-color="#20262e"/>
  <stop offset="1" stop-color="#454e5a"/>
</linearGradient>
<linearGradient id="${id}-track" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#05070a"/>
  <stop offset="0.28" stop-color="#14181f"/>
  <stop offset="0.72" stop-color="#101419"/>
  <stop offset="1" stop-color="#05070a"/>
</linearGradient>
<linearGradient id="${id}-fill" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${tone.edge}"/>
  <stop offset="0.3" stop-color="${tone.mid}"/>
  <stop offset="0.5" stop-color="${tone.hi}"/>
  <stop offset="0.72" stop-color="${tone.mid}"/>
  <stop offset="1" stop-color="${tone.edge}"/>
</linearGradient>
<linearGradient id="${id}-fillv" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.38"/>
  <stop offset="0.12" stop-color="#ffffff" stop-opacity="0.05"/>
  <stop offset="1" stop-color="#000000" stop-opacity="0.24"/>
</linearGradient>
<filter id="${id}-bloom" x="-400%" y="-20%" width="900%" height="140%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="0" stdDeviation="${n(sdA * k)}" flood-color="${tone.mid}" flood-opacity="${n(opA)}"/>
  <feDropShadow dx="0" dy="0" stdDeviation="${n(sdB * k)}" flood-color="${tone.mid}" flood-opacity="${n(opB)}"/>
</filter>`;

  let notches = '';
  for (let i = 1; i <= ticks; i++) {
    const ty = trackTop + ((trackBot - trackTop) * i) / (ticks + 1);
    notches += `<path d="M${n(x + w * 0.3)} ${n(ty)} H${n(x + w * 0.7)}" stroke="#000" stroke-width="${n(Math.max(0.8, w * 0.021))}" stroke-opacity="0.34"/>`;
  }
  const capH = Math.max(3, w * 0.15);
  const body = `<g>
  <path d="${rr(x, y, w, h, r)}" fill="url(#${id}-shell)"/>
  <path d="${rr(x + 1, y + 1, w - 2, h - 2, r - 1)}" fill="url(#${id}-track)"/>
  <path d="${fillPath}" fill="url(#${id}-fill)" filter="url(#${id}-bloom)"/>
  <path d="${fillPath}" fill="url(#${id}-fillv)"/>
  <path d="${rr(x + pad + 1, top + 1, w - pad * 2 - 2, capH, capH / 2)}" fill="#fff" opacity="${n(tone.cap)}"/>
  ${notches}
  <path d="${rr(x + 0.5, y + 0.5, w - 1, h - 1, r - 0.5)}" fill="none" stroke="#000" stroke-width="1.2" stroke-opacity="0.6"/>
  <path d="${rr(x, y, w, h, r)}" fill="none" stroke="#5a636f" stroke-width="1" stroke-opacity="0.7"/>
</g>`;
  return { defs, body, top, tone };
}
