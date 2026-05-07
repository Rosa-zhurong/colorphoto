const CITIES = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '重庆',
  '西安',
  '苏州',
  '南京',
  '武汉',
  '长沙',
  '青岛',
  '厦门',
  '大连',
  '昆明',
  '宁波',
  '无锡',
  '合肥',
  '济南',
]

export function pickCity() {
  const idx = Math.floor(Math.random() * CITIES.length)
  return CITIES[idx] ?? CITIES[0]!
}
