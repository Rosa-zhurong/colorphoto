// Image loading
export function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return loadImageFromUrl(url).finally(() => {
    URL.revokeObjectURL(url);
  });
}

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = url;
  });
}

// Color extraction from top portion of image - returns two similar colors for gradient
export function extractColors(image: HTMLImageElement, ratio: number): [string, string] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return ["#dbeafe", "#bfdbfe"];

  const w = Math.max(1, Math.floor(image.naturalWidth));
  const h = Math.max(1, Math.floor(image.naturalHeight));
  const sw = Math.min(240, w);
  const sh = Math.min(240, h);

  canvas.width = sw;
  canvas.height = sh;
  ctx.drawImage(image, 0, 0, sw, sh);

  const sampleHeight = Math.max(1, Math.floor(sh * Math.min(Math.max(ratio, 0.02), 0.5)));
  const data = ctx.getImageData(0, 0, sw, sampleHeight).data;

  // Sample top half and bottom half separately
  const halfHeight = Math.floor(sampleHeight / 2);
  let r1 = 0, g1 = 0, b1 = 0, count1 = 0;
  let r2 = 0, g2 = 0, b2 = 0, count2 = 0;

  for (let y = 0; y < sampleHeight; y++) {
    for (let x = 0; x < sw; x++) {
      const i = (y * sw + x) * 4;
      if ((data[i + 3] ?? 255) < 16) continue;
      if (y < halfHeight) {
        r1 += data[i] ?? 0;
        g1 += data[i + 1] ?? 0;
        b1 += data[i + 2] ?? 0;
        count1 += 1;
      } else {
        r2 += data[i] ?? 0;
        g2 += data[i + 1] ?? 0;
        b2 += data[i + 2] ?? 0;
        count2 += 1;
      }
    }
  }

  const color1 = count1 ? rgbToHex(Math.round(r1 / count1), Math.round(g1 / count1), Math.round(b1 / count1)) : "#dbeafe";
  const color2 = count2 ? rgbToHex(Math.round(r2 / count2), Math.round(g2 / count2), Math.round(b2 / count2)) : "#bfdbfe";

  return [color1, color2];
}

function clampByte(v: number): number {
  return Math.max(0, Math.min(255, v));
}

export function rgbToHex(r: number, g: number, b: number): string {
  const hex = (v: number) => clampByte(v).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

// Get contrasting text color based on background luminance
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Relative luminance (sRGB)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

// Date formatting
export function formatDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
}

// City name to pinyin
const cityPinyin: Record<string, string> = {
  "北京": "Beijing",
  "上海": "Shanghai",
  "广州": "Guangzhou",
  "深圳": "Shenzhen",
  "杭州": "Hangzhou",
  "成都": "Chengdu",
  "重庆": "Chongqing",
  "西安": "Xian",
  "苏州": "Suzhou",
  "南京": "Nanjing",
  "武汉": "Wuhan",
  "长沙": "Changsha",
  "青岛": "Qingdao",
  "厦门": "Xiamen",
  "大连": "Dalian",
  "昆明": "Kunming",
  "宁波": "Ningbo",
  "无锡": "Wuxi",
  "合肥": "Hefei",
  "济南": "Jinan",
  "天津": "Tianjin",
  "沈阳": "Shenyang",
  "哈尔滨": "Harbin",
  "郑州": "Zhengzhou",
  "福州": "Fuzhou",
  "南宁": "Nanning",
  "贵阳": "Guiyang",
  "太原": "Taiyuan",
  "石家庄": "Shijiazhuang",
  "长春": "Changchun",
};

export function toPinyin(city: string): string {
  return cityPinyin[city] || city;
}

// Poem/caption pool
const poems = [
  "我与大海，仅此而已。",
  "让时间在风中停下脚步。",
  "去没有天花板的地方。",
  "治愈所有的不开心。",
  "每一帧都是热爱生活。",
  "借我一点秋天的光。",
  "保持对世界的心动。",
];

export function randomPoem(): string {
  const index = Math.floor(Math.random() * poems.length);
  return poems[index] ?? poems[0];
}

// City database
const cities = [
  { name: "北京", lat: 39.9042, lng: 116.4074 },
  { name: "上海", lat: 31.2304, lng: 121.4737 },
  { name: "广州", lat: 23.1291, lng: 113.2644 },
  { name: "深圳", lat: 22.5431, lng: 114.0579 },
  { name: "杭州", lat: 30.2741, lng: 120.1552 },
  { name: "成都", lat: 30.5728, lng: 104.0668 },
  { name: "重庆", lat: 29.4316, lng: 106.9123 },
  { name: "西安", lat: 34.2619, lng: 108.9463 },
  { name: "苏州", lat: 31.3251, lng: 120.6299 },
  { name: "南京", lat: 32.0603, lng: 118.7969 },
  { name: "武汉", lat: 30.5928, lng: 114.3055 },
  { name: "长沙", lat: 28.228, lng: 112.9388 },
  { name: "青岛", lat: 36.0671, lng: 120.3826 },
  { name: "厦门", lat: 24.4798, lng: 118.0894 },
  { name: "大连", lat: 38.914, lng: 121.6147 },
  { name: "昆明", lat: 25.0389, lng: 102.7183 },
  { name: "宁波", lat: 29.8739, lng: 121.5497 },
  { name: "无锡", lat: 31.5754, lng: 120.3019 },
  { name: "合肥", lat: 31.8652, lng: 117.2272 },
  { name: "济南", lat: 36.6769, lng: 116.985 },
  { name: "天津", lat: 39.1422, lng: 117.2074 },
  { name: "沈阳", lat: 41.8045, lng: 123.4328 },
  { name: "哈尔滨", lat: 45.8038, lng: 126.535 },
  { name: "郑州", lat: 34.7466, lng: 113.6253 },
  { name: "福州", lat: 26.0738, lng: 119.2849 },
  { name: "南宁", lat: 22.8157, lng: 108.3201 },
  { name: "贵阳", lat: 26.5783, lng: 106.7132 },
  { name: "太原", lat: 37.8706, lng: 112.5488 },
  { name: "石家庄", lat: 38.0423, lng: 114.5025 },
  { name: "长春", lat: 43.8828, lng: 125.3258 },
];

export function randomCity(): string {
  const index = Math.floor(Math.random() * cities.length);
  return cities[index]?.name ?? cities[0].name;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function getNearestCity(lat: number, lng: number): string | undefined {
  let best: (typeof cities)[0] | undefined;
  let bestDist = Infinity;

  for (const city of cities) {
    const dist = haversineDistance(lat, lng, city.lat, city.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = city;
    }
  }

  if (best && bestDist < 100) return best.name;
  return undefined;
}

// EXIF parsing
interface ExifData {
  dateTime?: Date;
  latitude?: number;
  longitude?: number;
}

export async function parseExif(file: File): Promise<ExifData> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        const data = readExifData(result);
        resolve(data || {});
      } else {
        resolve({});
      }
    };
    reader.onerror = () => resolve({});
    reader.readAsArrayBuffer(file);
  });
}

function readExifData(buffer: ArrayBuffer): ExifData | null {
  const view = new DataView(buffer);

  // Check JPEG SOI marker
  if (view.getUint8(0) !== 0xff || view.getUint8(1) !== 0xd8) return null;

  let offset = 2;
  while (offset < view.byteLength - 1) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    offset += 2;

    if (marker === 0xe1) {
      // APP1 - EXIF
      return readExifSegment(view, offset);
    }

    if (marker === 0xda) break; // SOS - image data starts
    const segLen = view.getUint16(offset, false);
    offset += segLen;
  }
  return null;
}

function readExifSegment(view: DataView, offset: number): ExifData | null {
  const exifData: ExifData = {};

  // Check "Exif\0\0"
  if (
    view.getUint8(offset) !== 0x45 || // E
    view.getUint8(offset + 1) !== 0x78 || // x
    view.getUint8(offset + 2) !== 0x69 || // i
    view.getUint8(offset + 3) !== 0x66 // f
  ) {
    return null;
  }

  const tiffOffset = offset + 6;
  const byteOrder = view.getUint16(tiffOffset, false);
  const littleEndian = byteOrder === 0x4949; // II

  const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
  readIfd(view, tiffOffset, tiffOffset + ifdOffset, littleEndian, exifData);

  return exifData;
}

function readIfd(
  view: DataView,
  tiffStart: number,
  ifdStart: number,
  littleEndian: boolean,
  exifData: ExifData,
): void {
  const count = view.getUint16(ifdStart, littleEndian);
  let offset = ifdStart + 2;

  for (let i = 0; i < count; i++) {
    const entryOffset = offset + i * 12;
    if (entryOffset + 12 > view.byteLength) break;

    const tag = view.getUint16(entryOffset, littleEndian);
    const type = view.getUint16(entryOffset + 2, littleEndian);
    const numValues = view.getUint32(entryOffset + 4, littleEndian);

    // 0x8769 = ExifIFD pointer
    if (tag === 0x8769 && type === 4 && numValues === 1) {
      const subIfdOffset = view.getUint32(entryOffset + 8, littleEndian);
      readIfd(view, tiffStart, tiffStart + subIfdOffset, littleEndian, exifData);
      continue;
    }

    // 0x8825 = GPSInfo IFD pointer
    if (tag === 0x8825 && type === 4 && numValues === 1) {
      const gpsOffset = view.getUint32(entryOffset + 8, littleEndian);
      readGpsIfd(view, tiffStart, tiffStart + gpsOffset, littleEndian, exifData);
      continue;
    }

    // 0x9003 = DateTimeOriginal
    if (tag === 0x9003 && type === 2 && numValues === 20) {
      const strOffset = numValues > 4 ? view.getUint32(entryOffset + 8, littleEndian) : entryOffset + 8;
      const str = readAscii(view, tiffStart + strOffset, numValues);
      exifData.dateTime = parseExifDate(str);
    }
  }
}

function readGpsIfd(
  view: DataView,
  tiffStart: number,
  ifdStart: number,
  littleEndian: boolean,
  exifData: ExifData,
): void {
  const count = view.getUint16(ifdStart, littleEndian);
  let lat: number[] = [];
  let latRef = "";
  let lng: number[] = [];
  let lngRef = "";

  for (let i = 0; i < count; i++) {
    const entryOffset = ifdStart + 2 + i * 12;
    if (entryOffset + 12 > view.byteLength) break;

    const tag = view.getUint16(entryOffset, littleEndian);
    const type = view.getUint16(entryOffset + 2, littleEndian);
    const numValues = view.getUint32(entryOffset + 4, littleEndian);
    const valueOffset = numValues * componentSize(type) > 4
      ? view.getUint32(entryOffset + 8, littleEndian)
      : entryOffset + 8;

    switch (tag) {
      case 1: // GPSLatitudeRef
        latRef = readAscii(view, tiffStart + valueOffset, numValues);
        break;
      case 2: // GPSLatitude
        if (type === 5 && numValues === 3) {
          lat = [
            view.getUint32(tiffStart + valueOffset, littleEndian) / view.getUint32(tiffStart + valueOffset + 4, littleEndian),
            view.getUint8(tiffStart + valueOffset + 8) / view.getUint8(tiffStart + valueOffset + 12),
            view.getUint32(tiffStart + valueOffset + 16, littleEndian) / view.getUint32(tiffStart + valueOffset + 20, littleEndian),
          ];
        }
        break;
      case 3: // GPSLongitudeRef
        lngRef = readAscii(view, tiffStart + valueOffset, numValues);
        break;
      case 4: // GPSLongitude
        if (type === 5 && numValues === 3) {
          lng = [
            view.getUint32(tiffStart + valueOffset, littleEndian) / view.getUint32(tiffStart + valueOffset + 4, littleEndian),
            view.getUint8(tiffStart + valueOffset + 8) / view.getUint8(tiffStart + valueOffset + 12),
            view.getUint32(tiffStart + valueOffset + 16, littleEndian) / view.getUint32(tiffStart + valueOffset + 20, littleEndian),
          ];
        }
        break;
    }
  }

  if (lat.length === 3 && latRef) {
    exifData.latitude = dmsToDecimal(lat, latRef);
  }
  if (lng.length === 3 && lngRef) {
    exifData.longitude = dmsToDecimal(lng, lngRef);
  }
}

function componentSize(type: number): number {
  switch (type) {
    case 1: case 2: case 6: case 7: return 1;
    case 3: case 8: return 2;
    case 4: case 9: case 11: return 4;
    case 5: case 10: case 12: return 8;
    default: return 1;
  }
}

function readAscii(view: DataView, offset: number, length: number): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    const byte = view.getUint8(offset + i);
    if (byte === 0) break;
    str += String.fromCharCode(byte);
  }
  return str.trim();
}

function parseExifDate(str: string): Date | undefined {
  const match = str.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (match) {
    const [, year, month, day, hour, min, sec] = match;
    return new Date(
      parseInt(year!),
      parseInt(month!) - 1,
      parseInt(day!),
      parseInt(hour!),
      parseInt(min!),
      parseInt(sec!),
    );
  }
  return undefined;
}

function dmsToDecimal(dms: number[], ref: string): number {
  const value = dms[0] + dms[1] / 60 + dms[2] / 3600;
  return ref === "S" || ref === "W" ? -value : value;
}

// Canvas helpers
export function drawTextCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
): void {
  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + Math.max(0, chars.length - 1) * letterSpacing;
  let currentX = x - totalWidth / 2;

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i]!;
    const charWidth = widths[i]!;
    ctx.fillText(char, currentX, y);
    currentX += charWidth + letterSpacing;
  }
}

export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
): void {
  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;
  if (!naturalW || !naturalH) return;

  const scale = Math.max(dw / naturalW, dh / naturalH);
  const cropW = dw / scale;
  const cropH = dh / scale;
  const cropX = (naturalW - cropW) / 2;
  const cropY = (naturalH - cropH) / 2;

  ctx.drawImage(img, cropX, cropY, cropW, cropH, dx, dy, dw, dh);
}

export function addNoiseOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  alpha: number,
): void {
  const noiseCanvas = document.createElement("canvas");
  noiseCanvas.width = 256;
  noiseCanvas.height = 256;
  const noiseCtx = noiseCanvas.getContext("2d");
  if (!noiseCtx) return;

  const imageData = noiseCtx.createImageData(256, 256);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }
  noiseCtx.putImageData(imageData, 0, 0);

  const pattern = ctx.createPattern(noiseCanvas, "repeat");
  if (pattern) {
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = alpha;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
