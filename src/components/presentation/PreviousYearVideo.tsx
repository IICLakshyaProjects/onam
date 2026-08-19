"use client";

import { useEffect, useRef, useState } from "react";
import type { onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import { useFirstInteraction } from "@/lib/useFirstInteraction";
import Petals from "@/components/effects/Petals";
import Particles from "@/components/effects/Particles";
import Confetti from "@/components/effects/Confetti";
import Fireworks from "@/components/effects/Fireworks";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";

type PreviousYearVideoProps = {
  src: string;
  fallbackDurationMs: number;
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  videoMode?: "original" | "enlarged";
  paused: boolean;
  onComplete: () => void;
};

/**
 * Fullscreen, autoplaying highlight reel from last year's celebration.
 * Tries to autoplay WITH sound first; if the browser's autoplay policy
 * blocks that, it falls back to muted autoplay (so playback never breaks)
 * and recovers sound automatically on the first key/tap/click. Falls back
 * to a cinematic placeholder (and a timed auto-advance) if the video file
 * is missing or fails to load.
 */
export default function PreviousYearVideo({
  src,
  fallbackDurationMs,
  motifImages,
  videoMode = "original",
  paused,
  onComplete,
}: PreviousYearVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [needsSoundGesture, setNeedsSoundGesture] = useState(false);

  // Initial autoplay attempt — try WITH sound first; only fall back to muted
  // if the browser's autoplay policy blocks it (never blocks a muted play()).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      setNeedsSoundGesture(true);
      video.play().catch(() => setFailed(true));
    });
    // Runs once when this scene instance mounts.
  }, []);

  // Reflect pause/resume from the presentation state machine (kept separate
  // from the mount-time autoplay negotiation above so toggling pause never
  // re-triggers the muted/unmuted dance).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    if (paused) {
      video.pause();
    } else if (video.ended === false) {
      video.play().catch(() => {});
    }
  }, [paused, failed]);

  // Most browsers block unmuted autoplay outright but reliably allow sound
  // right after the first real user gesture — recover it there.
  useFirstInteraction(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      if (!paused) video.play().catch(() => {});
    }
    setNeedsSoundGesture(false);
  });

  // Only used when the video can't play at all — advances the presentation on a timer instead.
  usePausableSequence(
    failed ? [fallbackDurationMs] : [],
    () => {},
    onComplete,
    paused,
    failed ? "fallback" : "video"
  );

  return (
    <div className="onam-stage scene-enter bg-black overflow-hidden">
      {!failed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            className={
              videoMode === "enlarged"
                ? "block h-[92vh] w-[92vw] max-h-none max-w-none bg-black object-contain"
                : "block h-full w-full max-h-none max-w-none bg-black object-contain"
            }
            src={src}
            playsInline
            onEnded={onComplete}
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <PlaceholderScreen />
      )}
      <div className="light-rays opacity-60" />
      <div className="glow-orb h-[32rem] w-[32rem] opacity-70" />
      <div className="cinematic-overlay" />
      <RangoliGlow />
      <Particles density={22} paused={paused} />
      <Petals density={18} paused={paused} />
      <Confetti density={12} paused={paused} />
      <Fireworks auto autoIntervalMs={3200} paused={paused} />
      <OnamMotifField
        types={["lamp", "leaf", "boat", "pookalam", "chenda"]}
        count={5}
        imageSrcs={motifImages}
      />
      {needsSoundGesture && (
        <p className="absolute top-8 right-8 z-10 text-xs uppercase tracking-[0.3em] text-onam-gold/50">
          Press any key for sound
        </p>
      )}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 text-center">
        {/* <p className="text-sm uppercase tracking-[0.5em] text-onam-gold/80">Last Year&apos;s Memories</p> */}
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
