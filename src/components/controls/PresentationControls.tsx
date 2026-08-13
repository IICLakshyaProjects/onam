"use client";

import { useEffect } from "react";
import { SCENE_ORDER } from "@/components/presentation/types";

type PresentationControlsProps = {
  onTogglePause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  onJumpToScene: (index: number) => void;
};

/**
 * Operator/developer keyboard shortcuts for the presentation. Renders
 * nothing — these controls are intentionally invisible during the live
 * show, they only exist for testing and manual control.
 *
 *   SPACE        pause / resume
 *   ARROW RIGHT  next scene
 *   ARROW LEFT   previous scene
 *   F            toggle fullscreen
 *   R            restart presentation
 *   ESC          exit fullscreen
 *   1-6          jump directly to a scene (dev/testing aid)
 */
export default function PresentationControls({
  onTogglePause,
  onNext,
  onPrevious,
  onRestart,
  onJumpToScene,
}: PresentationControlsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid hijacking typing if a future dev UI ever adds inputs.
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      switch (event.code) {
        case "Space":
          event.preventDefault();
          onTogglePause();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrevious();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
        case "KeyR":
          onRestart();
          break;
        case "Escape":
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          break;
        default: {
          const digitMatch = /^Digit([1-6])$/.exec(event.code);
          if (digitMatch) {
            const index = Number(digitMatch[1]) - 1;
            if (index < SCENE_ORDER.length) onJumpToScene(index);
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTogglePause, onNext, onPrevious, onRestart, onJumpToScene]);

  return null;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}
