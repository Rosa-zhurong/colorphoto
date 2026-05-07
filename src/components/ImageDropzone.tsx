import { useMemo, useRef, useState } from 'react'

type Props = {
  onSelect: (file: File) => void
  disabled?: boolean
}

export default function ImageDropzone({ onSelect, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const accept = useMemo(() => 'image/*', [])

  return (
    <div
      className={[
        'rounded-xl border-2 border-dashed p-10 text-center transition-colors select-none',
        isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:bg-gray-50',
        disabled ? 'opacity-60 pointer-events-none' : 'cursor-pointer',
      ].join(' ')}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (disabled) return
        setIsDragging(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (disabled) return
        setIsDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        if (disabled) return
        const dropped = e.dataTransfer.files?.[0]
        if (!dropped) return
        if (!dropped.type.startsWith('image/')) return
        onSelect(dropped)
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        inputRef.current?.click()
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0]
          if (!selected) return
          onSelect(selected)
          e.target.value = ''
        }}
      />
      <div className="space-y-2">
        <p className="text-gray-500 font-medium tracking-wide">点击或拖拽图片到这里</p>
        <p className="text-gray-400 text-xs mt-2 font-mono">支持 JPG, PNG 等格式</p>
      </div>
    </div>
  )
}

