import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import Poster from "./components/Poster";
import Upload from "./components/Upload";
import {
  loadImage,
  extractColors,
  formatDate,
  randomCity,
  getNearestCity,
  parseExif,
  toPinyin,
} from "./lib/utils";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [gradientColors, setGradientColors] = useState<[string, string]>(["#FFFFFF", "#F3F4F6"]);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<string>(formatDate(new Date()));
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const displayText = location ? `${location}  ${date}` : date;

  useEffect(() => {
    if (!file) {
      reset();
      return;
    }

    let cancelled = false;

    (async () => {
      const [img, exif] = await Promise.all([loadImage(file), parseExif(file)]);
      if (cancelled) return;

      setImage(img);
      setGradientColors(extractColors(img, 0.12));

      if (exif.dateTime) {
        setDate(formatDate(exif.dateTime));
      }

      if (exif.latitude && exif.longitude) {
        const city = getNearestCity(exif.latitude, exif.longitude);
        setLocation(toPinyin(city || randomCity()));
      } else {
        setLocation(toPinyin(randomCity()));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [file]);

  const reset = () => {
    setFile(null);
    setImage(null);
    setGradientColors(["#FFFFFF", "#F3F4F6"]);
    setLocation("");
    setDate(formatDate(new Date()));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `vibe-poster-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleStartEdit = () => {
    setEditText(displayText);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSaveEdit = () => {
    const parts = editText.split(/\s{2,}/);
    if (parts.length >= 2) {
      setLocation(parts[0] || "");
      setDate(parts[1].trim());
    } else if (location) {
      setLocation(editText);
    } else {
      setDate(editText.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif text-center font-bold text-gray-900 tracking-wider">
            ColorTrip
          </h1>
        </div>

        {file ? (
          <div className="space-y-3">
            <div
              className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative cursor-pointer"
              onClick={() => !isEditing && handleStartEdit()}
            >
              <Poster
                ref={canvasRef}
                gradientColors={gradientColors}
                text={isEditing ? editText : displayText}
                image={image}
              />

              {/* Editable text frame */}
              {isEditing && (
                <div
                  className="absolute border-2 border-white/60 border-dashed rounded-lg pointer-events-none"
                  style={{
                    top: '21%',
                    left: '8%',
                    width: '84%',
                    height: '11%',
                  }}
                />
              )}

              {/* Transparent input overlay on the text area */}
              {isEditing && (
                <input
                  ref={inputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveEdit();
                    }
                    if (e.key === 'Escape') {
                      setIsEditing(false);
                    }
                  }}
                  className="absolute bg-transparent border-none outline-none text-center w-4/5"
                  style={{
                    top: '24%',
                    left: '10%',
                    height: '5%',
                    fontSize: 'clamp(12px, 4.5vw, 24px)',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    fontFamily: '"Courier New", Courier, monospace',
                    color: 'transparent',
                    caretColor: 'white',
                  }}
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="truncate">{file.name}</span>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button
                    className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                    onClick={handleSaveEdit}
                    type="button"
                  >
                    完成
                  </button>
                ) : (
                  <button
                    className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                    onClick={handleDownload}
                    type="button"
                  >
                    <Download className="w-3.5 h-3.5" />
                    下载
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Upload onSelect={setFile} />
        )}
      </div>
    </div>
  );
}
