/** Build a barrel-distortion displacement map for SVG feDisplacementMap. */
export function createBarrelDisplacementDataUrl(size = 256, strength = 1.35): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const image = ctx.createImageData(size, size)
  const cx = (size - 1) / 2
  const cy = (size - 1) / 2

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x - cx) / cx
      const dy = (y - cy) / cy
      const r2 = Math.min(1.35, dx * dx + dy * dy)
      const force = r2 * r2 * strength
      const i = (y * size + x) * 4
      image.data[i] = Math.max(0, Math.min(255, 128 + dx * force * 127))
      image.data[i + 1] = Math.max(0, Math.min(255, 128 + dy * force * 127))
      image.data[i + 2] = 128
      image.data[i + 3] = 255
    }
  }

  ctx.putImageData(image, 0, 0)
  return canvas.toDataURL('image/png')
}
