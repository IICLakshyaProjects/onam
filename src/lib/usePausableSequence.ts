"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a sequence of timed steps without duplicating timer logic across
 * scenes. `onStep(index)` fires the instant a step becomes active (including
 * step 0 on mount), and `onComplete()` fires once the final step's duration
 * has elapsed.
 *
 * - Pausing freezes the remaining time of the *current* step; resuming
 *   continues from exactly where it left off (no drift, no restart).
 * - The sequence only restarts from step 0 when `resetKey` changes, so
 *   toggling `paused` never resets progress.
 * - Uses requestAnimationFrame instead of setTimeout/setInterval so it stays
 *   in lockstep with rendering and cleans up deterministically on unmount.
 *
 * An empty `durationsMs` means "no timer" — the hook does nothing and waits
 * for something else (e.g. a video's `onEnded`) to call `onComplete`. It
 * does NOT fire `onComplete` itself; pass a real (even 1ms) duration if you
 * want an immediate auto-skip.
 */
export function usePausableSequence(
  durationsMs: number[],
  onStep: (index: number) => void,
  onComplete: () => void,
  paused: boolean,
  resetKey: string | number
): void {
  const onStepRef = useRef(onStep);
  const onCompleteRef = useRef(onComplete);
  const pausedRef = useRef(paused);

  useEffect(() => {
    onStepRef.current = onStep;
    onCompleteRef.current = onComplete;
    pausedRef.current = paused;
  });

  const durationsKey = durationsMs.join(",");

  useEffect(() => {
    if (durationsMs.length === 0) {
      // No sequence configured — do nothing and let an external event
      // (e.g. video `onEnded`) drive completion instead.
      return;
    }

    let cancelled = false;
    let index = 0;
    let remaining = durationsMs[0];
    let lastTime = performance.now();
    let rafId = 0;

    onStepRef.current(0);

    const tick = (now: number) => {
      if (cancelled) return;
      const dt = now - lastTime;
      lastTime = now;

      if (!pausedRef.current) {
        remaining -= dt;
        if (remaining <= 0) {
          index += 1;
          if (index >= durationsMs.length) {
            onCompleteRef.current();
            return;
          }
          onStepRef.current(index);
          remaining = durationsMs[index] + remaining;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
    // Only a genuine reset (or a change to the actual duration plan) should
    // restart the sequence from step 0 — `paused` is deliberately excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, durationsKey]);
}
