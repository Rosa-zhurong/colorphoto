import exifr from 'exifr'

export interface ExifData {
  dateTime?: Date
  latitude?: number
  longitude?: number
}

export async function extractExifData(file: File): Promise<ExifData> {
  try {
    const data = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true
    })
    
    if (!data) return {}

    return {
      dateTime: data.DateTimeOriginal || data.CreateDate || data.ModifyDate,
      latitude: data.latitude,
      longitude: data.longitude
    }
  } catch (error) {
    console.error('Error parsing EXIF data:', error)
    return {}
  }
}

