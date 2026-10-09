export const STAGE = {
  floor: '#0d1117',
  gutter: '#0a0a0c',
  panel: '#161b22',
  edge: '#30363d',
  text: '#c9d1d9',
  dim: '#6e7681',
  violet: '#6e40c9',
  violetHot: '#a371f7',
  play: '#ff4d1a',
  playHot: '#ff8c00',
};

/** Window brand table — locked in DESIGN.md "Window brands". */
export const BRAND = {
  loop: { accent: '#ff4d6d', light: '#ff8fa3', ink: '#4a0f1e', deep: '#3d1421', label: 'loop' },
  pulse: { accent: '#2f81f7', light: '#79b8ff', ink: '#0a1c33', deep: '#0d1d33', label: 'pulse' },
  wave: { accent: '#2ee07a', light: '#7af0a8', ink: '#07261a', deep: '#0b3d2e', label: 'wave' },
  echo: { accent: '#ff0033', light: '#ff5c7a', ink: '#3d0210', deep: '#1b0710', label: 'echo' },
  alerts: { accent: '#f5a623', light: '#ffce6a', ink: '#3d2606', deep: '#2a1a08', label: 'alerts' },
  /** `09`: "Minigame frame — Neutral dark stroke". Must not steal Loop pink. */
  minigame: { accent: '#93a1b2', light: '#c9d4e0', ink: '#141922', deep: '#0f141b', label: 'minigame' },
};

export const DOPAMINE = {
  hot: '#ff8c00',
  hotLight: '#ffb347',
  cold: '#7b2cbf',
  coldDeep: '#5b1d8a',
  trough: '#2a0f3d',
};

/** Cardboard-cutout construction colours (Lane Defender / Endless Runner cast). */
export const CARD = {
  keyline: '#1d2430',
  edge: '#f2e4c9',
  edgeShade: '#cdbb98',
  shadow: '#05070a',
};

export const NUM = {
  posFill: '#2ee07a',
  posInk: '#04140d',
  negFill: '#ff4d6d',
  negInk: '#2a0510',
  plate: '#10151d',
  plateEdge: '#2b333f',
};

export function rr(x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  return `M${+(x + rad).toFixed(2)} ${+y.toFixed(2)} H${+(x + w - rad).toFixed(2)} A${rad} ${rad} 0 0 1 ${+(x + w).toFixed(2)} ${+(y + rad).toFixed(2)} V${+(y + h - rad).toFixed(2)} A${rad} ${rad} 0 0 1 ${+(x + w - rad).toFixed(2)} ${+(y + h).toFixed(2)} H${+(x + rad).toFixed(2)} A${rad} ${rad} 0 0 1 ${+x.toFixed(2)} ${+(y + h - rad).toFixed(2)} V${+(y + rad).toFixed(2)} A${rad} ${rad} 0 0 1 ${+(x + rad).toFixed(2)} ${+y.toFixed(2)} Z`;
}

export function n(v) {
  return +(+v).toFixed(2);
}

/** Deterministic PRNG so re-runs produce byte-identical art. */
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

export function mix(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return (
    '#' +
    pa
      .map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0'))
      .join('')
  );
}

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
