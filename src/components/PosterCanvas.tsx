import { forwardRef, useEffect, useMemo, useRef } from 'react';
import { drawCoverImage, drawTrackedText, drawNoise } from '../lib/canvas';

type Props = {
  backgroundColor: string
  caption: string
  dateText: string
  location: string
  image: HTMLImageElement | null
}

const POSTER_WIDTH = 1080
const POSTER_HEIGHT = 1440
const HEADER_RATIO = 0.48

const PosterCanvas = forwardRef<HTMLCanvasElement, Props>(function PosterCanvas(
  { backgroundColor, caption, dateText, location, image },
  ref,
) {
  const localRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRef = useMemo(() => {
    if (typeof ref === 'function') return localRef
    if (ref && typeof ref === 'object') return ref
    return localRef
  }, [ref])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(POSTER_WIDTH * dpr)
    canvas.height = Math.floor(POSTER_HEIGHT * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)

    const headerHeight = POSTER_HEIGHT * HEADER_RATIO

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, POSTER_WIDTH, headerHeight)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, headerHeight, POSTER_WIDTH, POSTER_HEIGHT - headerHeight)

    if (image) {
      drawCoverImage(ctx, image, 0, headerHeight, POSTER_WIDTH, POSTER_HEIGHT - headerHeight)
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, headerHeight, POSTER_WIDTH, POSTER_HEIGHT - headerHeight)
    }

    const titleY = headerHeight * 0.48
    const dateY = headerHeight * 0.62
    const locationY = headerHeight * 0.74

    ctx.textBaseline = 'middle'

    // Draw Caption (Title)
    ctx.font = '500 32px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#1a1a1a';
    drawTrackedText(ctx, caption, POSTER_WIDTH / 2, titleY, 12);

    // Draw Date
    ctx.font = '400 16px "Courier New", Courier, monospace';
    ctx.fillStyle = '#6b7280';
    drawTrackedText(ctx, dateText, POSTER_WIDTH / 2, dateY, 6);

    // Draw Location
    if (location) {
      ctx.font = '400 16px "Courier New", Courier, monospace';
      ctx.fillStyle = '#6b7280';
      drawTrackedText(ctx, location, POSTER_WIDTH / 2, locationY, 4);
    }

    // Add Film Grain Noise Overlay
    drawNoise(ctx, POSTER_WIDTH, POSTER_HEIGHT, 0.15)
  }, [backgroundColor, caption, dateText, location, image, canvasRef])

  return (
    <canvas
      ref={(node) => {
        localRef.current = node
        if (typeof ref === 'function') ref(node)
        if (ref && typeof ref === 'object') ref.current = node
      }}
      className="w-full h-auto block"
      style={{ aspectRatio: `${POSTER_WIDTH} / ${POSTER_HEIGHT}` }}
    />
  )
})

export default PosterCanvas

