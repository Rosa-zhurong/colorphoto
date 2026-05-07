import { useEffect, useRef, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import ImageDropzone from './components/ImageDropzone'
import PosterCanvas from './components/PosterCanvas'
import { formatPosterDate } from './lib/date'
import { pickCaption } from './lib/caption'
import { pickCity } from './lib/location'
import { extractTopAverageColor, loadImageFromFile } from './lib/image'
import { extractExifData } from './lib/exif'
import { getCityFromCoordinates } from './lib/geocode'

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF')
  const [caption, setCaption] = useState('这里是你的诗和远方')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState<Date | null>(null)
  const dateText = date ? formatPosterDate(date) : formatPosterDate(new Date())

  useEffect(() => {
    if (!file) {
      handleReset()
      return
    }

    let cancelled = false

    ;(async () => {
      const [img, exif] = await Promise.all([
        loadImageFromFile(file),
        extractExifData(file)
      ])
      
      if (cancelled) return
      
      setImage(img)
      setBackgroundColor(extractTopAverageColor(img, 0.12))
      setCaption(pickCaption())
      
      if (exif.dateTime) {
        setDate(exif.dateTime)
      } else {
        setDate(new Date())
      }
      
      if (exif.latitude && exif.longitude) {
        const city = getCityFromCoordinates(exif.latitude, exif.longitude)
        setLocation(city || pickCity())
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (cancelled) return
            const city = getCityFromCoordinates(pos.coords.latitude, pos.coords.longitude)
            setLocation(city || pickCity())
          },
          () => {
            if (cancelled) return
            setLocation(pickCity())
          },
          { timeout: 5000 }
        )
      } else {
        setLocation(pickCity())
      }
    })()

    return () => {
      cancelled = true
    }
  }, [file])

  const handleReset = () => {
    setFile(null)
    setImage(null)
    setBackgroundColor('#FFFFFF')
    setCaption('这里是你的诗和远方')
    setLocation('')
    setDate(null)
  }

  const handleRegenerate = () => {
    setCaption(pickCaption())
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `vibe-poster-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif text-center font-bold text-gray-900 tracking-wider">氛围海报</h1>
          <p className="text-center text-gray-500 text-sm font-mono tracking-widest">VIBE POSTER</p>
        </div>

        {!file ? (
          <ImageDropzone onSelect={setFile} />
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <PosterCanvas
                ref={canvasRef}
                backgroundColor={backgroundColor}
                caption={caption}
                dateText={dateText}
                location={location}
                image={image}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="truncate">{file.name}</span>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  onClick={handleRegenerate}
                  type="button"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  换文案
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                  onClick={handleDownload}
                  type="button"
                >
                  <Download className="w-3.5 h-3.5" />
                  下载
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
