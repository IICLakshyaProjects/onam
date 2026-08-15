"use client";

import { useEffect, useRef } from "react";
import { useFullscreenCanvas } from "@/lib/useFullscreenCanvas";
import { PARTICLE_PALETTE } from "@/lib/palette";

type Piece = {
  x: number;
  y: number;
  size: number;
  fallSpeed: number;
  drift: number;
  driftPhase: number;
  rotation: number;
  spin: number;
  flipPhase: number;
  flipSpeed: number;
  color: string;
};

type ConfettiProps = {
  /** Ambient pieces continuously raining in the background. */
  density?: number;
  /** Change this value to fire an extra celebratory shower (e.g. an incrementing counter). */
  burstTrigger?: number | string;
  paused?: boolean;
  className?: string;
};

/**
 * Small tumbling ribbon/rectangle confetti — visually distinct from the
 * rounder `Petals`, tuned to the same Onam palette so it reads as premium
 * paper streamers rather than generic rainbow confetti. One canvas, capped
 * particle count even when bursts stack up.
 */
export default function Confetti({ density = 26, burstTrigger, paused = false, className }: ConfettiProps) {
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const burstRef = useRef<() => void>(() => {});

  const canvasRef = useFullscreenCanvas((ctx) => {
    function makePiece(randomY: boolean, xOverride?: number): Piece {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return {
        x: xOverride ?? Math.random() * w,
        y: randomY ? Math.random() * h : -20,
        size: 6 + Math.random() * 7,
        fallSpeed: 26 + Math.random() * 30,
        drift: 10 + Math.random() * 16,
        driftPhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 2.4,
        flipPhase: Math.random() * Math.PI * 2,
        flipSpeed: 2 + Math.random() * 3,
        color: PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)],
      };
    }

    const pieces: Piece[] = Array.from({ length: density }, () => makePiece(true));
    const MAX_PIECES = density + 90;

    burstRef.current = () => {
      const w = window.innerWidth;
      const extra = 45;
      for (let i = 0; i < extra; i++) {
        if (pieces.length >= MAX_PIECES) pieces.shift();
        pieces.push(makePiece(false, Math.random() * w));
      }
    };

    function draw(p: Piece) {
      const flip = Math.cos(p.flipPhase);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.max(Math.abs(flip), 0.15), 1);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
      ctx.restore();
    }

    let lastTime = performance.now();
    let rafId = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (!pausedRef.current) {
        for (let i = pieces.length - 1; i >= 0; i--) {
          const p = pieces[i];
          p.y += p.fallSpeed * dt;
          p.driftPhase += dt;
          p.x += Math.sin(p.driftPhase) * p.drift * dt;
          p.rotation += p.spin * dt;
          p.flipPhase += p.flipSpeed * dt;

          if (p.y - p.size > h) {
            if (i >= density) {
              // Extra burst piece finished its fall — let it go instead of recycling forever.
              pieces.splice(i, 1);
            } else {
              Object.assign(p, makePiece(false));
            }
          }
        }
      }

      for (const p of pieces) draw(p);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  });

  useEffect(() => {
    if (burstTrigger === undefined) return;
    burstRef.current();
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 ${className ?? ""}`}
    />
  );
}
