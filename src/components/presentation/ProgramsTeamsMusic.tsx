"use client";

import { useEffect, useRef } from "react";

type ProgramsTeamsMusicProps = {
  src: string;
  active: boolean;
  paused: boolean;
};

export default function ProgramsTeamsMusic({ src, active, paused }: ProgramsTeamsMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startAt = 0;
    const primeAndPlay = () => {
      audio.volume = 0.12;
      if (audio.currentTime < startAt || audio.currentTime > startAt + 0.5) {
        audio.currentTime = startAt;
      }
      audio.play().catch(() => {});
    };

    const onLoadedMetadata = () => {
      primeAndPlay();
    };

    if (audio.readyState >= 1) {
      primeAndPlay();
    } else {
      audio.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.pause();
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!active || paused) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [active, paused]);

  if (!active) return null;

  return <audio ref={audioRef} src={src} preload="auto" />;
}
