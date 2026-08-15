"use client";

import { useEffect, useState } from "react";

// One shared cache for the whole page session: a given src is checked with a
// single lightweight HEAD request the first time anything asks about it, and
// every later caller (including every remount across a looping presentation)
// just awaits that same cached promise instead of issuing its own request.
const availabilityCache = new Map<string, Promise<boolean>>();

function checkAvailability(src: string): Promise<boolean> {
  let cached = availabilityCache.get(src);
  if (!cached) {
    cached = fetch(src, { method: "HEAD" })
      .then((res) => res.ok)
      .catch(() => false);
    availabilityCache.set(src, cached);
  }
  return cached;
}

/**
 * Resolves whether an optional image `src` actually exists, checked at most
 * once per unique path for the entire page session (not per component
 * mount). Returns `false` while unset/unknown/missing so callers can render
 * a fallback immediately and swap in the real image only once confirmed —
 * never a blank gap while checking.
 */
export function useImageAvailability(src: string | undefined): boolean {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    // Initial state is already `false` — nothing to do until a real src shows up.
    if (!src) return;
    let cancelled = false;
    checkAvailability(src).then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return available;
}

/**
 * Like `useImageAvailability`, but for a small set of candidate paths for
 * the *same* image (e.g. "chenda.webp" and "chenda.png") — resolves to the
 * first candidate (in the given priority order) that actually exists, or
 * `undefined` if none do. Each candidate is still only ever HEAD-checked
 * once per page session via the same shared cache.
 */
export function useFirstAvailableSrc(candidates: string[] | undefined): string | undefined {
  const [resolved, setResolved] = useState<string | undefined>(undefined);
  const key = candidates?.join("|") ?? "";

  useEffect(() => {
    if (!candidates || candidates.length === 0) return;
    let cancelled = false;
    Promise.all(candidates.map((src) => checkAvailability(src).then((ok) => (ok ? src : undefined)))).then(
      (results) => {
        if (cancelled) return;
        setResolved(results.find((r): r is string => Boolean(r)));
      }
    );
    return () => {
      cancelled = true;
    };
    // `candidates` is an array literal that's often re-created per render —
    // `key` captures its actual contents so the effect only reruns on real change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return resolved;
}
