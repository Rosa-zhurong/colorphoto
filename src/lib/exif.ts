export interface ExifData {
  dateTime?: Date
  latitude?: number
  longitude?: number
}

function getStringFromDataView(dataView: DataView, offset: number, length: number): string {
  let str = ''
  for (let i = 0; i < length; i++) {
    str += String.fromCharCode(dataView.getUint8(offset + i))
  }
  return str
}

function readExifData(buffer: ArrayBuffer): ExifData | null {
  const dataView = new DataView(buffer)
  
  if (dataView.getUint16(0) !== 0xFFD8) {
    return null
  }

  let offset = 2
  const length = dataView.byteLength

  while (offset < length) {
    const marker = dataView.getUint16(offset)
    offset += 2
    
    if (marker === 0xFFE1) {
      dataView.getUint16(offset)
      offset += 2
      
      const exifHeader = getStringFromDataView(dataView, offset, 6)
      if (exifHeader === 'Exif\0\0') {
        offset += 6
        
        const tiffHeader = dataView.getUint16(offset)
        const isLittleEndian = tiffHeader === 0x4949
        
        offset += 4
        
        const firstIfdOffset = dataView.getUint32(offset, isLittleEndian)
        offset += firstIfdOffset
        
        const tagCount = dataView.getUint16(offset, isLittleEndian)
        offset += 2
        
        let dateTimeTag: string | undefined
        let gpsLatitude: number[] = []
        let gpsLatitudeRef: string | undefined
        let gpsLongitude: number[] = []
        let gpsLongitudeRef: string | undefined
        
        for (let i = 0; i < tagCount; i++) {
          const tag = dataView.getUint16(offset, isLittleEndian)
          offset += 2
          const format = dataView.getUint16(offset, isLittleEndian)
          offset += 2
          const componentCount = dataView.getUint32(offset, isLittleEndian)
          offset += 4
          
          let valueOffset = offset
          if (componentCount * getFormatSize(format) > 4) {
            valueOffset = dataView.getUint32(offset, isLittleEndian)
          }
          
          switch (tag) {
            case 0x0132:
              if (format === 2) {
                dateTimeTag = getStringFromDataView(dataView, valueOffset, componentCount - 1)
              }
              break
            case 0x8825:
              const gpsIfdOffset = dataView.getUint32(offset - 4, isLittleEndian)
              const gpsData = parseGpsIfd(dataView, gpsIfdOffset, isLittleEndian)
              gpsLatitude = gpsData.latitude || []
              gpsLatitudeRef = gpsData.latitudeRef
              gpsLongitude = gpsData.longitude || []
              gpsLongitudeRef = gpsData.longitudeRef
              break
          }
          
          offset += 4
        }
        
        let dateTime: Date | undefined
        if (dateTimeTag) {
          dateTime = parseExifDateTime(dateTimeTag)
        }
        
        let latitude: number | undefined
        let longitude: number | undefined
        
        if (gpsLatitude.length === 3 && gpsLatitudeRef && gpsLongitude.length === 3 && gpsLongitudeRef) {
          latitude = convertDmsToDegrees(gpsLatitude, gpsLatitudeRef)
          longitude = convertDmsToDegrees(gpsLongitude, gpsLongitudeRef)
        }
        
        return { dateTime, latitude, longitude }
      }
    } else {
      const sectionLength = dataView.getUint16(offset)
      offset += sectionLength + 2
    }
  }
  
  return null
}

function getFormatSize(format: number): number {
  switch (format) {
    case 1: return 1
    case 2: return 1
    case 3: return 2
    case 4: return 4
    case 5: return 8
    case 7: return 1
    default: return 1
  }
}

function parseGpsIfd(dataView: DataView, offset: number, isLittleEndian: boolean) {
  const tagCount = dataView.getUint16(offset, isLittleEndian)
  offset += 2
  
  let latitude: number[] = []
  let latitudeRef: string | undefined
  let longitude: number[] = []
  let longitudeRef: string | undefined
  
  for (let i = 0; i < tagCount; i++) {
    const tag = dataView.getUint16(offset, isLittleEndian)
    offset += 2
    const format = dataView.getUint16(offset, isLittleEndian)
    offset += 2
    const componentCount = dataView.getUint32(offset, isLittleEndian)
    offset += 4
    
    let valueOffset = offset
    if (componentCount * getFormatSize(format) > 4) {
      valueOffset = dataView.getUint32(offset, isLittleEndian)
    }
    
    switch (tag) {
      case 0x0001:
        latitudeRef = getStringFromDataView(dataView, valueOffset, 1)
        break
      case 0x0002:
        if (format === 5 && componentCount === 3) {
          latitude = [
            dataView.getUint32(valueOffset, isLittleEndian) / dataView.getUint32(valueOffset + 4, isLittleEndian),
            dataView.getUint32(valueOffset + 8, isLittleEndian) / dataView.getUint32(valueOffset + 12, isLittleEndian),
            dataView.getUint32(valueOffset + 16, isLittleEndian) / dataView.getUint32(valueOffset + 20, isLittleEndian)
          ]
        }
        break
      case 0x0003:
        longitudeRef = getStringFromDataView(dataView, valueOffset, 1)
        break
      case 0x0004:
        if (format === 5 && componentCount === 3) {
          longitude = [
            dataView.getUint32(valueOffset, isLittleEndian) / dataView.getUint32(valueOffset + 4, isLittleEndian),
            dataView.getUint32(valueOffset + 8, isLittleEndian) / dataView.getUint32(valueOffset + 12, isLittleEndian),
            dataView.getUint32(valueOffset + 16, isLittleEndian) / dataView.getUint32(valueOffset + 20, isLittleEndian)
          ]
        }
        break
    }
    
    offset += 4
  }
  
  return { latitude, latitudeRef, longitude, longitudeRef }
}

function parseExifDateTime(dateTimeString: string): Date | undefined {
  const match = dateTimeString.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)
  if (match) {
    const [, year, month, day, hour, minute, second] = match
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    )
  }
  return undefined
}

function convertDmsToDegrees(dms: number[], ref: string): number {
  const degrees = dms[0] + dms[1] / 60 + dms[2] / 3600
  return ref === 'S' || ref === 'W' ? -degrees : degrees
}

export async function extractExifData(file: File): Promise<ExifData> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const result = e.target?.result
      if (result instanceof ArrayBuffer) {
        const exif = readExifData(result)
        resolve(exif || {})
      } else {
        resolve({})
      }
    }
    
    reader.onerror = () => {
      resolve({})
    }
    
    reader.readAsArrayBuffer(file)
  })
}
