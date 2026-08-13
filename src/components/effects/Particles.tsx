"use client";

import { useEffect, useRef } from "react";
import { useFullscreenCanvas } from "@/lib/useFullscreenCanvas";
import { ONAM_COLORS } from "@/lib/palette";

type Spark = {
  x: number;
  y: number;
  radius: number;
  riseSpeed: number;
  twinklePhase: number;
  twinkleSpeed: number;
  baseOpacity: number;
};

type ParticlesProps = {
  /** Number of drifting golden sparks. */
  density?: number;
  paused?: boolean;
  className?: string;
};

/**
 * Slow-rising, twinkling golden dust — used to give poster / date-reveal
 * scenes a premium "stage light" atmosphere without any imagery.
 */
export default function Particles({ density = 40, paused = false, className }: ParticlesProps) {
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const canvasRef = useFullscreenCanvas((ctx) => {
    function spawn(randomY: boolean): Spark {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + 10,
        radius: 1 + Math.random() * 2.4,
        riseSpeed: 8 + Math.random() * 16,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 1 + Math.random() * 2,
        baseOpacity: 0.3 + Math.random() * 0.5,
      };
    }

    const sparks: Spark[] = Array.from({ length: density }, () => spawn(true));
    let lastTime = performance.now();
    let rafId = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (const s of sparks) {
        if (!pausedRef.current) {
          s.y -= s.riseSpeed * dt;
          s.twinklePhase += dt * s.twinkleSpeed;
          if (s.y < -10) Object.assign(s, spawn(false));
        }

        const twinkle = 0.5 + 0.5 * Math.sin(s.twinklePhase);
        ctx.beginPath();
        ctx.globalAlpha = s.baseOpacity * twinkle;
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 4);
        gradient.addColorStop(0, ONAM_COLORS.gold);
        gradient.addColorStop(1, "rgba(232, 181, 69, 0)");
        ctx.fillStyle = gradient;
        ctx.arc(s.x, s.y, s.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

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
