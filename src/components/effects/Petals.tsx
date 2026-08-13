"use client";

import { useEffect, useRef } from "react";
import { useFullscreenCanvas } from "@/lib/useFullscreenCanvas";
import { PARTICLE_PALETTE } from "@/lib/palette";

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  driftPhase: number;
  rotation: number;
  spin: number;
  color: string;
  opacity: number;
};

type PetalsProps = {
  /** Number of petals on screen at once. Keep modest — this is ambient decoration, not a hero effect. */
  density?: number;
  /** Pause the animation loop (e.g. when the presentation itself is paused). */
  paused?: boolean;
  className?: string;
};

/**
 * Lightweight, continuously falling flower-petal ambience rendered on a
 * single full-viewport canvas. Designed to run for hours on a large display
 * without accumulating DOM nodes or leaking timers.
 */
export default function Petals({ density = 22, paused = false, className }: PetalsProps) {
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const canvasRef = useFullscreenCanvas((ctx) => {
    const petals: Petal[] = Array.from({ length: density }, () => spawnPetal(true));
    let rafId = 0;

    function spawnPetal(randomY: boolean): Petal {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -20,
        size: 8 + Math.random() * 12,
        speed: 18 + Math.random() * 22,
        drift: 12 + Math.random() * 18,
        driftPhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.2,
        color: PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)],
        opacity: 0.35 + Math.random() * 0.4,
      };
    }

    function drawPetal(p: Petal) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      ctx.fill();
      ctx.restore();
    }

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (!pausedRef.current) {
        for (const p of petals) {
          p.y += p.speed * dt;
          p.driftPhase += dt;
          p.x += Math.sin(p.driftPhase) * p.drift * dt;
          p.rotation += p.spin * dt;

          if (p.y - p.size > h) {
            Object.assign(p, spawnPetal(false));
          }
        }
      }

      for (const p of petals) drawPetal(p);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 ${className ?? ""}`}
    />
  );
}
