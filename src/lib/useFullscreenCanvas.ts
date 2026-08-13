"use client";

import { useEffect, useRef } from "react";

/**
 * Shared setup for full-viewport canvas-based effects: sizes the canvas to
 * the viewport (accounting for devicePixelRatio so strokes stay crisp),
 * keeps it in sync on resize, and hands the draw loop a ready 2D context.
 * The returned cleanup is handled internally — callers just supply `draw`.
 */
export function useFullscreenCanvas(
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => () => void
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const stopDraw = draw(ctx, window.innerWidth, window.innerHeight);

    return () => {
      window.removeEventListener("resize", resize);
      stopDraw();
    };
    // `draw` is expected to be stable (defined once per mount via useCallback/ref pattern in callers).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return canvasRef;
}
