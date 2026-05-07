const CANDIDATES = [
  '我与大海，仅此而已。',
  '让时间在风中停下脚步。',
  '去没有天花板的地方。',
  '治愈所有的不开心。',
  '每一帧都是热爱生活。',
  '借我一点秋天的光。',
  '保持对世界的心动。',
]

export function pickCaption() {
  const idx = Math.floor(Math.random() * CANDIDATES.length)
  return CANDIDATES[idx] ?? CANDIDATES[0]!
}

