import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { drawImageCover, drawTextCentered, addNoiseOverlay, getContrastColor } from "../lib/utils";

const WIDTH = 1080;
const HEIGHT = 1440;
const IMAGE_RATIO = 0.48;

interface PosterProps {
  gradientColors: [string, string];
  text: string;
  image: HTMLImageElement | null;
}

const Poster = forwardRef<HTMLCanvasElement | null, PosterProps>(
  ({ gradientColors, text, image }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current!, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(WIDTH * dpr);
      canvas.height = Math.floor(HEIGHT * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Top portion: gradient background + text
      const topHeight = HEIGHT * IMAGE_RATIO;
      const gradient = ctx.createLinearGradient(0, 0, 0, topHeight);
      gradient.addColorStop(0, gradientColors[0]);
      gradient.addColorStop(1, gradientColors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, topHeight);

      // Bottom portion: photo
      const bottomHeight = HEIGHT - topHeight;
      if (image) {
        drawImageCover(ctx, image, 0, topHeight, WIDTH, bottomHeight);
      }

      // Text (location + date)
      const textY = topHeight * 0.52;
      ctx.textBaseline = "middle";
      ctx.font = 'italic 700 64px "Courier New", Courier, monospace';
      const avgColor = gradientColors[0];
      ctx.fillStyle = getContrastColor(avgColor);
      drawTextCentered(ctx, text, WIDTH / 2, textY, 4);

      // Noise overlay
      addNoiseOverlay(ctx, WIDTH, HEIGHT, 0.15);
    }, [gradientColors, text, image]);

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-auto block"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      />
    );
  },
);

Poster.displayName = "Poster";

export default Poster;
