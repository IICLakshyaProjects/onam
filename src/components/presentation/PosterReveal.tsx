"use client";

import { useState } from "react";
import Image from "next/image";
import type { onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Particles from "@/components/effects/Particles";
import Petals from "@/components/effects/Petals";
import Confetti from "@/components/effects/Confetti";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";

type PosterRevealProps = {
  src: string;
  durationMs: number;
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  paused: boolean;
  onComplete: () => void;
};

export default function PosterReveal({ src, durationMs, motifImages, paused, onComplete }: PosterRevealProps) {
  const [failed, setFailed] = useState(false);

  usePausableSequence([durationMs], () => {}, onComplete, paused, "poster");

  return (
    <div className="onam-stage scene-enter flex items-center justify-center">
      <div className="light-rays" />
      <div className="glow-orb h-[40rem] w-[40rem]" />
      <RangoliGlow />
      <Particles density={36} paused={paused} />
      <Petals density={12} paused={paused} />
      <Confetti density={14} paused={paused} />
      <OnamMotifField types={["pookalam", "lamp", "sadya", "leaf"]} count={4} imageSrcs={motifImages} />

      <div className="poster-reveal relative z-10 flex h-[82%] w-[86%] items-center justify-center sm:h-[78%] sm:w-[62%]">
        {!failed ? (
          <Image
            src={src}
            alt="This year's Onam celebration poster"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "contain" }}
            onError={() => setFailed(true)}
          />
        ) : (
          <PlaceholderPoster />
        )}
      </div>

      <p className="absolute bottom-14 z-10 text-sm uppercase tracking-[0.5em] text-onam-gold/70">
        This Year&apos;s Celebration
      </p>
    </div>
  );
}

function PlaceholderPoster() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-2xl border border-onam-gold/30 bg-black/40 p-12 text-center">
      <p className="text-sm uppercase tracking-[0.6em] text-onam-gold/70">Poster Coming Soon</p>
      <h2 className="text-shimmer text-5xl font-bold sm:text-6xl">Onam Celebration</h2>
      <p className="max-w-xl text-lg text-onam-cream/70">
        Add <code className="rounded bg-black/40 px-2 py-1 text-onam-gold">/public/media/onam-poster.png</code> to
        display this year&apos;s poster here.
      </p>
    </div>
  );
}
