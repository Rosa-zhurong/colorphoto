interface City {
  name: string
  lat: number
  lng: number
}

const CITIES: City[] = [
  { name: '北京', lat: 39.9042, lng: 116.4074 },
  { name: '上海', lat: 31.2304, lng: 121.4737 },
  { name: '广州', lat: 23.1291, lng: 113.2644 },
  { name: '深圳', lat: 22.5431, lng: 114.0579 },
  { name: '杭州', lat: 30.2741, lng: 120.1552 },
  { name: '成都', lat: 30.5728, lng: 104.0668 },
  { name: '重庆', lat: 29.4316, lng: 106.9123 },
  { name: '西安', lat: 34.2619, lng: 108.9463 },
  { name: '苏州', lat: 31.3251, lng: 120.6299 },
  { name: '南京', lat: 32.0603, lng: 118.7969 },
  { name: '武汉', lat: 30.5928, lng: 114.3055 },
  { name: '长沙', lat: 28.2280, lng: 112.9388 },
  { name: '青岛', lat: 36.0671, lng: 120.3826 },
  { name: '厦门', lat: 24.4798, lng: 118.0894 },
  { name: '大连', lat: 38.9140, lng: 121.6147 },
  { name: '昆明', lat: 25.0389, lng: 102.7183 },
  { name: '宁波', lat: 29.8739, lng: 121.5497 },
  { name: '无锡', lat: 31.5754, lng: 120.3019 },
  { name: '合肥', lat: 31.8652, lng: 117.2272 },
  { name: '济南', lat: 36.6769, lng: 116.9850 },
  { name: '天津', lat: 39.1422, lng: 117.2074 },
  { name: '沈阳', lat: 41.8045, lng: 123.4328 },
  { name: '哈尔滨', lat: 45.8038, lng: 126.5350 },
  { name: '郑州', lat: 34.7466, lng: 113.6253 },
  { name: '福州', lat: 26.0738, lng: 119.2849 },
  { name: '南宁', lat: 22.8157, lng: 108.3201 },
  { name: '贵阳', lat: 26.5783, lng: 106.7132 },
  { name: '太原', lat: 37.8706, lng: 112.5488 },
  { name: '石家庄', lat: 38.0423, lng: 114.5025 },
  { name: '长春', lat: 43.8828, lng: 125.3258 },
]

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getCityFromCoordinates(latitude: number, longitude: number): string | undefined {
  let closestCity: City | undefined
  let minDistance = Infinity

  for (const city of CITIES) {
    const distance = haversineDistance(latitude, longitude, city.lat, city.lng)
    if (distance < minDistance) {
      minDistance = distance
      closestCity = city
    }
  }

  if (closestCity && minDistance < 100) {
    return closestCity.name
  }

  return undefined
}
