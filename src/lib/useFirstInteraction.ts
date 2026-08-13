"use client";

import { useEffect, useRef } from "react";

/**
 * Fires `onInteract` once, on the very first keydown/pointerdown/touchstart
 * anywhere on the page, then detaches. Browsers that block unmuted autoplay
 * (or a suspended AudioContext) reliably unlock on the first real user
 * gesture — this is the shared hook that recovers sound once that gesture
 * happens, instead of duplicating the same three listeners per effect.
 */
export function useFirstInteraction(onInteract: () => void): void {
  const onInteractRef = useRef(onInteract);

  useEffect(() => {
    onInteractRef.current = onInteract;
  }, [onInteract]);

  useEffect(() => {
    let handled = false;
    const options: AddEventListenerOptions = { capture: true };

    const handler = () => {
      if (handled) return;
      handled = true;
      onInteractRef.current();
      window.removeEventListener("pointerdown", handler, options);
      window.removeEventListener("keydown", handler, options);
      window.removeEventListener("touchstart", handler, options);
    };

    window.addEventListener("pointerdown", handler, options);
    window.addEventListener("keydown", handler, options);
    window.addEventListener("touchstart", handler, options);

    return () => {
      window.removeEventListener("pointerdown", handler, options);
      window.removeEventListener("keydown", handler, options);
      window.removeEventListener("touchstart", handler, options);
    };
  }, []);
}
