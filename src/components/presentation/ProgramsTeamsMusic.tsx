"use client";

import { useEffect, useRef } from "react";

type ProgramsTeamsMusicProps = {
  src: string;
  active: boolean;
  paused: boolean;
};

export default function ProgramsTeamsMusic({ src, active, paused }: ProgramsTeamsMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const previousActiveRef = useRef(active);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const clearFadeTimer = () => {
      if (fadeTimerRef.current !== null) {
        window.clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    };

    const startFadeOut = () => {
      clearFadeTimer();

      const fadeMs = 1400;
      const tickMs = 50;
      const steps = Math.max(1, Math.round(fadeMs / tickMs));
      const volumeStep = (audio.volume || 0.12) / steps;

      fadeTimerRef.current = window.setInterval(() => {
        audio.volume = Math.max(0, audio.volume - volumeStep);
        if (audio.volume <= 0.001) {
          clearFadeTimer();
          audio.pause();
          audio.volume = 0.12;
        }
      }, tickMs);
    };

    const startAudio = () => {
      clearFadeTimer();
      audio.volume = 0.12;
      audio.play().catch(() => {});
    };

    const onClosingAdvanceVisible = () => {
      startFadeOut();
    };

    window.addEventListener("onam-closing-advance-visible", onClosingAdvanceVisible as EventListener);

    if (active) {
      startAudio();
    } else if (previousActiveRef.current) {
      startFadeOut();
    } else if (paused) {
      audio.pause();
    }

    previousActiveRef.current = active;

    return () => {
      window.removeEventListener("onam-closing-advance-visible", onClosingAdvanceVisible as EventListener);
      clearFadeTimer();
    };
  }, [active, paused, src]);

  return <audio ref={audioRef} src={src} preload="auto" />;
}
