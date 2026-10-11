import { readFileSync } from 'node:fs';
import { n } from './brand.mjs';
import { out } from './render.mjs';

/**
 * Lift finished art out of committed SVG masters so layout comps are built
 * from the shipped Phase C/D files rather than redrawn copies of them. When a
 * master changes, re-running the comp emitter picks the change up.
 */

export function readContent(rel) {
  return readFileSync(out(rel), 'utf8');
}

/** Namespace every id so several imported documents can share one <defs>. */
export function prefixIds(markup, p) {
  return markup
    .replace(/\sid="([^"]+)"/g, (_, id) => ` id="${p}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${p}-${id})`)
    .replace(/((?:xlink:)?href)="#([^"]+)"/g, (_, attr, id) => `${attr}="#${p}-${id}"`);
}

/** Index just past the `</g>` that closes the `<g` opening at `start`. */
function closeOf(src, start) {
  const re = /<g[\s>]|<\/g>/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m[0] === '</g>') {
      depth--;
      if (depth === 0) return m.index + 4;
    } else depth++;
  }
  throw new Error('unbalanced <g> group');
}

/** Split a <defs> body into its top-level elements, keyed by id. */
function defElements(defs) {
  const els = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)\b[^>]*?(\/?)>/g;
  let depth = 0;
  let start = -1;
  let m;
  while ((m = re.exec(defs))) {
    const [tag, closing, , selfClose] = m;
    if (!closing && depth === 0) start = m.index;
    if (closing) depth--;
    else if (!selfClose) depth++;
    if (depth === 0 && start >= 0) {
      const text = defs.slice(start, m.index + tag.length);
      const id = (text.match(/^<[^>]*\sid="([^"]+)"/) || [])[1];
      els.push({ id, text });
      start = -1;
    }
  }
  return els;
}

/** Keep only the defs a body actually reaches (transitively). */
function pruneDefs(defs, body) {
  const els = defElements(defs);
  const byId = new Map(els.filter((e) => e.id).map((e) => [e.id, e]));
  const refs = (s) => [...s.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] || m[2]);
  const keep = new Set();
  const queue = refs(body);
  while (queue.length) {
    const id = queue.pop();
    if (keep.has(id) || !byId.has(id)) continue;
    keep.add(id);
    queue.push(...refs(byId.get(id).text));
  }
  return els.filter((e) => e.id && keep.has(e.id)).map((e) => e.text).join('\n');
}

function split(src) {
  const a = src.indexOf('<defs>');
  const b = src.indexOf('</defs>');
  const defs = a >= 0 ? src.slice(a + 6, b) : '';
  const bodyStart = a >= 0 ? b + 7 : src.indexOf('>', src.indexOf('<svg')) + 1;
  const body = src.slice(bodyStart, src.lastIndexOf('</svg>')).replace(/<title>[\s\S]*?<\/title>/, '');
  const [, , w, h] = src.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  return { defs, body, w, h };
}

/** A whole committed SVG (icon, sticker) as an embeddable fragment. */
export function importSvg(rel, p) {
  const { defs, body, w, h } = split(readContent(rel));
  return { defs: prefixIds(pruneDefs(defs, body), p), body: prefixIds(body, p), w, h };
}

/** One `<g …>` group out of a committed SVG, picked by a substring of its opening tag. */
export function liftGroup(rel, p, openTag) {
  const src = readContent(rel);
  const { defs } = split(src);
  const hit = src.indexOf(openTag);
  if (hit < 0) throw new Error(`${rel}: no group ${openTag}`);
  const at = src.lastIndexOf('<g', hit);
  const body = src.slice(at, closeOf(src, at));
  return { defs: prefixIds(pruneDefs(defs, body), p), body: prefixIds(body, p) };
}

/**
 * The authored interior of a Phase C solo window mockup. Interiors are drawn
 * in a 1000-unit-wide local space and placed with one translate/scale group,
 * so the group content is the interior at its native size.
 */
export function windowInterior(name, p = name) {
  const rel = `content/mockups/window_${name}.svg`;
  const src = readContent(rel);
  const open = '<g transform="translate(210 200) scale(1.18)">';
  const at = src.indexOf(open);
  if (at < 0) throw new Error(`${rel}: interior group not found`);
  const inner = src.slice(at + open.length, closeOf(src, at) - 4);
  const bg = inner.match(/<rect width="(\d+(?:\.\d+)?)" height="(\d+(?:\.\d+)?)" fill="url\(#([^)]+)\)"\/>/);
  const { defs } = split(src);
  const grad = defs.match(new RegExp(`<linearGradient id="${bg[3]}"[\\s\\S]*?</linearGradient>`))[0];
  const stops = [...grad.matchAll(/stop-color="([^"]+)"/g)].map((m) => m[1]);
  return {
    defs: prefixIds(pruneDefs(defs, inner), p),
    body: prefixIds(inner, p),
    w: +bg[1],
    h: +bg[2],
    skinTop: stops[0],
    skinBottom: stops[stops.length - 1],
    bgId: `${p}-${bg[3]}`,
  };
}

/** One Alert card from the Phase C alerts mockup, re-origined to (0,0). */
export function alertCard(index, p = `al${index}`) {
  const rel = 'content/mockups/window_alerts.svg';
  const g = liftGroup(rel, p, `<g filter="url(#am${index}-sh)">`);
  const m = g.body.match(/<path d="M([\d.]+) ([\d.]+) H([\d.]+) A14 14 0 0 1 [\d.]+ [\d.]+ V([\d.]+)/);
  const x = +m[1] - 14;
  const y = +m[2];
  const w = +m[3] + 14 - x;
  const h = +m[4] + 14 - y;
  return { defs: g.defs, body: `<g transform="translate(${n(-x)} ${n(-y)})">${g.body}</g>`, w, h };
}

/**
 * Fit an authored interior into a window body without stretching it.
 *
 * `scale` defaults to cover-by-width. The interior is top-anchored and
 * centred; any cut edge fades into the window's own skin so overflow reads as
 * a panel that scrolls further, and any spare margin is filled with the same
 * skin so the panel never shows a seam.
 */
export function fitInterior(it, box, { scale, focusY = 0, fade = 34, id }) {
  const s = scale ?? box.w / it.w;
  const dw = it.w * s;
  const dh = it.h * s;
  const dx = box.x + (box.w - dw) / 2;
  const dy = box.y - focusY * s;
  const fid = `fit-${id}`;
  let defs = `
<linearGradient id="${fid}-b" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${it.skinBottom}" stop-opacity="0"/>
  <stop offset="0.7" stop-color="${it.skinBottom}" stop-opacity="0.86"/>
  <stop offset="1" stop-color="${it.skinBottom}" stop-opacity="1"/>
</linearGradient>
<linearGradient id="${fid}-t" x1="0" y1="1" x2="0" y2="0">
  <stop offset="0" stop-color="${it.skinTop}" stop-opacity="0"/>
  <stop offset="1" stop-color="${it.skinTop}" stop-opacity="0.95"/>
</linearGradient>`;
  let body = `<rect x="${n(box.x)}" y="${n(box.y)}" width="${n(box.w)}" height="${n(box.h)}" fill="url(#${it.bgId})"/>`;
  body += `<g transform="translate(${n(dx)} ${n(dy)}) scale(${n(s * 10000) / 10000})">${it.body}</g>`;
  const bottomCut = dy + dh > box.y + box.h + 0.5;
  if (bottomCut) {
    body += `<rect x="${n(box.x)}" y="${n(box.y + box.h - fade)}" width="${n(box.w)}" height="${n(fade + 1)}" fill="url(#${fid}-b)"/>`;
  }
  if (focusY > 0) {
    body += `<rect x="${n(box.x)}" y="${n(box.y)}" width="${n(box.w)}" height="${n(fade * 0.6)}" fill="url(#${fid}-t)"/>`;
  }
  return { defs, body, scale: s };
}

/**
 * Show one authored region of an interior as its own panel: clip the source
 * rectangle and place it, uniformly scaled, at (x, y). Used to re-arrange a
 * desktop interior into a compact mobile window without redrawing it.
 */
export function region(it, src, x, y, s, id) {
  const clip = `<clipPath id="rg-${id}"><rect x="${n(src.x)}" y="${n(src.y)}" width="${n(src.w)}" height="${n(src.h)}"/></clipPath>`;
  const body = `<g transform="translate(${n(x - src.x * s)} ${n(y - src.y * s)}) scale(${n(s * 10000) / 10000})"><g clip-path="url(#rg-${id})">${it.body}</g></g>`;
  return { defs: clip, body, w: src.w * s, h: src.h * s };
}

export function placeFragment(frag, x, y, s = 1, extra = '') {
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s * 10000) / 10000})${extra ? ' ' + extra : ''}">${frag.body}</g>`;
}
