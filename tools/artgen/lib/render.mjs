import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repo root, derived from this file's own location (tools/artgen/lib). */
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

function ensure(p) {
  mkdirSync(dirname(p), { recursive: true });
}

export function out(rel) {
  return resolve(ROOT, rel);
}

export function writeSvg(rel, svg) {
  const p = out(rel);
  ensure(p);
  writeFileSync(p, svg.trim() + '\n');
  return p;
}

export function rasterize(svg, width) {
  const r = new Resvg(svg, {
    fitTo: width ? { mode: 'width', value: Math.round(width) } : { mode: 'original' },
    font: { loadSystemFonts: true, defaultFontFamily: 'Public Sans' },
  });
  return r.render().asPng();
}

/**
 * Drop the pHYs chunk. libvips derives it from the image resolution and
 * different builds round 72dpi to either 2834 or 2835 pixels-per-metre, which
 * rewrites every PNG on a re-run for no visual reason. Sprite DPI is
 * meaningless here, so removing the chunk makes output byte-reproducible.
 */
function stripDensity(png) {
  const keep = [png.subarray(0, 8)];
  let o = 8;
  while (o + 8 <= png.length) {
    const len = png.readUInt32BE(o);
    const type = png.subarray(o + 4, o + 8).toString('latin1');
    if (type !== 'pHYs') keep.push(png.subarray(o, o + 12 + len));
    o += 12 + len;
  }
  return Buffer.concat(keep);
}

async function encodePng(input) {
  return stripDensity(await sharp(input).png({ compressionLevel: 9 }).toBuffer());
}

export async function writePng(rel, svg, width) {
  const p = out(rel);
  ensure(p);
  writeFileSync(p, await encodePng(rasterize(svg, width)));
  return p;
}

export async function writeWebp(rel, svg, width, quality = 92) {
  const p = out(rel);
  ensure(p);
  const png = rasterize(svg, width);
  await sharp(png).webp({ quality }).toFile(p);
  return p;
}

export async function writeWebpFromPng(rel, png, quality = 92) {
  const p = out(rel);
  ensure(p);
  await sharp(png).webp({ quality }).toFile(p);
  return p;
}

/** Inline a rasterized SVG as a PNG data URI so resvg can embed it in <image>. */
export function dataUri(svg, width) {
  return 'data:image/png;base64,' + rasterize(svg, width).toString('base64');
}

export async function fileDataUri(rel) {
  return 'data:image/png;base64,' + (await encodePng(out(rel))).toString('base64');
}
