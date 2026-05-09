import { useMemo, useRef, useState } from "react";

interface UploadProps {
  onSelect: (file: File) => void;
  disabled?: boolean;
}

export default function Upload({ onSelect, disabled }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const accept = useMemo(() => "image/*", []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onSelect(file);
    }
  };

  return (
    <div
      className={[
        "rounded-xl border-2 border-dashed p-10 text-center transition-colors select-none",
        dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:bg-gray-50",
        disabled ? "opacity-60 pointer-events-none" : "cursor-pointer",
      ].join(" ")}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
      }}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onSelect(file);
            e.target.value = "";
          }
        }}
      />
      <div className="space-y-2">
        <p className="text-gray-500 font-medium tracking-wide">点击或拖拽图片到这里</p>
        <p className="text-gray-400 text-xs mt-2 font-mono">支持 JPG, PNG 等格式</p>
      </div>
    </div>
  );
}
