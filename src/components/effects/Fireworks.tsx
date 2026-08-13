"use client";

import { useEffect, useRef } from "react";
import { useFullscreenCanvas } from "@/lib/useFullscreenCanvas";
import { PARTICLE_PALETTE } from "@/lib/palette";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

type FireworksProps = {
  /** Change this value to fire a fresh burst (e.g. an incrementing counter). */
  burstTrigger?: number | string;
  /** When true, bursts fire automatically at random positions/intervals — used for the finale. */
  auto?: boolean;
  autoIntervalMs?: number;
  paused?: boolean;
  className?: string;
};

/**
 * Canvas-based cracker/firework bursts. Each burst is a short-lived batch of
 * ~40 particles with gravity + drag, cleared once fully faded — never more
 * than a couple hundred live particles even with frequent bursts.
 */
export default function Fireworks({
  burstTrigger,
  auto = false,
  autoIntervalMs = 1400,
  paused = false,
  className,
}: FireworksProps) {
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const sparksRef = useRef<Spark[]>([]);
  const fireRef = useRef<(x?: number, y?: number) => void>(() => {});

  const canvasRef = useFullscreenCanvas((ctx) => {
    const sparks = sparksRef.current;

    fireRef.current = (x, y) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const originX = x ?? w * (0.3 + Math.random() * 0.4);
      const originY = y ?? h * (0.28 + Math.random() * 0.24);
      const count = 44;
      const baseColor = PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const speed = 120 + Math.random() * 180;
        sparks.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 0.7 + Math.random() * 0.5,
          color: Math.random() > 0.3 ? baseColor : PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)],
          size: 2 + Math.random() * 2,
        });
      }
    };

    let lastTime = performance.now();
    let rafId = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (!pausedRef.current) {
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.life += dt;
          if (s.life >= s.maxLife) {
            sparks.splice(i, 1);
            continue;
          }
          s.vy += 220 * dt; // gravity
          s.vx *= 0.98; // drag
          s.vy *= 0.98;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
        }
      }

      for (const s of sparks) {
        const fade = 1 - s.life / s.maxLife;
        ctx.globalAlpha = Math.max(fade, 0);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      sparks.length = 0;
    };
  });

  // Fire a burst whenever the trigger value changes.
  useEffect(() => {
    if (burstTrigger === undefined) return;
    fireRef.current();
  }, [burstTrigger]);

  // Optional continuous random bursts for the grand finale.
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      if (!pausedRef.current) fireRef.current();
    }, autoIntervalMs);
    return () => clearInterval(id);
  }, [auto, autoIntervalMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-20 ${className ?? ""}`}
    />
  );
}
