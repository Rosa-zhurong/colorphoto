export function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const iw = image.naturalWidth || image.width
  const ih = image.naturalHeight || image.height
  if (!iw || !ih) return

  const scale = Math.max(w / iw, h / ih)
  const sw = w / scale
  const sh = h / scale
  const sx = (iw - sw) / 2
  const sy = (ih - sh) / 2

  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h)
}

export function drawTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  tracking: number,
) {
  const chars = Array.from(text)
  const widths = chars.map((ch) => ctx.measureText(ch).width)
  const total =
    widths.reduce((sum, w) => sum + w, 0) + Math.max(0, chars.length - 1) * tracking
  let x = centerX - total / 2

  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i]!
    const w = widths[i]!
    ctx.fillText(ch, x, centerY)
    x += w + tracking
  }
}

export function drawNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.12
) {
  const tileSize = 256;
  const offscreen = document.createElement('canvas');
  offscreen.width = tileSize;
  offscreen.height = tileSize;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  const imgData = offCtx.createImageData(tileSize, tileSize);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const color = Math.random() * 255;
    data[i] = color;     // r
    data[i + 1] = color; // g
    data[i + 2] = color; // b
    data[i + 3] = 255;   // a
  }

  offCtx.putImageData(imgData, 0, 0);

  const pattern = ctx.createPattern(offscreen, 'repeat');
  if (!pattern) return;

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = opacity;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

