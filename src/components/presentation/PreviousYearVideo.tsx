"use client";

import { useEffect, useRef, useState } from "react";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Petals from "@/components/effects/Petals";

type PreviousYearVideoProps = {
  src: string;
  fallbackDurationMs: number;
  paused: boolean;
  onComplete: () => void;
};

/**
 * Fullscreen, muted, autoplaying highlight reel from last year's celebration.
 * Falls back to a cinematic placeholder (and a timed auto-advance) if the
 * video file is missing or fails to load, so a blank asset can never break
 * the sequence.
 */
export default function PreviousYearVideo({
  src,
  fallbackDurationMs,
  paused,
  onComplete,
}: PreviousYearVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    // Setting `muted` imperatively (not just the JSX attribute) is the
    // reliable way to satisfy browser autoplay policies before calling play().
    video.muted = true;
    if (paused) {
      video.pause();
    } else {
      video.play().catch(() => setFailed(true));
    }
  }, [paused, failed]);

  // Only used when the video can't play at all — advances the presentation on a timer instead.
  usePausableSequence(
    failed ? [fallbackDurationMs] : [],
    () => {},
    onComplete,
    paused,
    failed ? "fallback" : "video"
  );

  return (
    <div className="onam-stage scene-enter">
      {!failed ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          autoPlay
          muted
          playsInline
          onEnded={onComplete}
          onError={() => setFailed(true)}
        />
      ) : (
        <PlaceholderScreen />
      )}
      <div className="cinematic-overlay" />
      <Petals density={14} paused={paused} />
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 text-center">
        <p className="text-sm uppercase tracking-[0.5em] text-onam-gold/80">Last Year&apos;s Memories</p>
      </div>
    </div>
  );
}

function PlaceholderScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
      <div className="glow-orb h-[36rem] w-[36rem]" style={{ top: "10%" }} />
      <div className="light-rays" />
      <p className="z-10 text-sm uppercase tracking-[0.6em] text-onam-gold/80">Onam Celebration</p>
      <h1 className="text-shimmer z-10 px-8 text-center text-5xl font-bold sm:text-7xl">
        Relive Last Year&apos;s Joy
      </h1>
      <p className="z-10 max-w-2xl px-8 text-center text-lg text-onam-cream/70">
        Add <code className="rounded bg-black/40 px-2 py-1 text-onam-gold">/public/media/previous-onam.mp4</code> to
        play the previous year&apos;s highlight reel here.
      </p>
    </div>
  );
}
