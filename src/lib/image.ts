export async function loadImageFromFile(file: File) {
  const url = URL.createObjectURL(file)
  try {
    return await loadImageFromUrl(url)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function loadImageFromUrl(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = url
  })
}

export function extractTopAverageColor(image: HTMLImageElement, topRatio: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return '#dbeafe'

  const w = Math.max(1, Math.floor(image.naturalWidth))
  const h = Math.max(1, Math.floor(image.naturalHeight))
  const sampleW = Math.min(240, w)
  const sampleH = Math.min(240, h)

  canvas.width = sampleW
  canvas.height = sampleH
  ctx.drawImage(image, 0, 0, sampleW, sampleH)

  const topH = Math.max(1, Math.floor(sampleH * Math.min(Math.max(topRatio, 0.02), 0.5)))
  const data = ctx.getImageData(0, 0, sampleW, topH).data

  let r = 0
  let g = 0
  let b = 0
  let count = 0

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] ?? 255
    if (a < 16) continue
    r += data[i] ?? 0
    g += data[i + 1] ?? 0
    b += data[i + 2] ?? 0
    count += 1
  }

  if (!count) return '#dbeafe'
  return rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count))
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(clampByte(r))}${toHex(clampByte(g))}${toHex(clampByte(b))}`
}

function clampByte(n: number) {
  return Math.min(255, Math.max(0, Math.round(n)))
}

