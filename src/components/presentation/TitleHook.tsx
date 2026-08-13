"use client";

import { useState } from "react";
import type { onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Petals from "@/components/effects/Petals";
import Confetti from "@/components/effects/Confetti";
import Particles from "@/components/effects/Particles";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";

type TitleHookProps = {
  titleHook: (typeof onamConfig)["titleHook"];
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  presentedByMs: number;
  headingMs: number;
  paused: boolean;
  onComplete: () => void;
};

/**
 * Opening hook shown before the previous-year video: a presenter credit
 * ("IIC Lakshya Presents") that settles into a small caption, then the main
 * title bursts in — over a softly animated backdrop of traditional Onam
 * motifs (chenda, pulikali, lamp, pookalam, leaf, boat) drifting behind the
 * text, plus a pulsing rangoli-style floor glow.
 */
export default function TitleHook({ titleHook, motifImages, presentedByMs, headingMs, paused, onComplete }: TitleHookProps) {
  const [phase, setPhase] = useState<0 | 1>(0);

  usePausableSequence(
    [presentedByMs, headingMs],
    (index) => setPhase(index as 0 | 1),
    onComplete,
    paused,
    "title-hook"
  );

  const revealed = phase === 1;

  return (
    <div className="onam-stage scene-enter flex flex-col items-center justify-center overflow-hidden">
      <div className="light-rays" />
      <div className="glow-orb h-[38rem] w-[38rem]" />
      <RangoliGlow />
      <Particles density={30} paused={paused} />
      <Petals density={16} paused={paused} />
      <Confetti density={14} burstTrigger={revealed ? "revealed" : undefined} paused={paused} />

      {/* Drifting Onam motifs — kept to the edges so they never fight the text. */}
      <OnamMotifField
        types={["chenda", "lamp", "pookalam", "leaf", "pulikali", "boat"]}
        count={6}
        imageSrcs={motifImages}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <p
          className={
            revealed
              ? "title-presents-settle text-sm uppercase tracking-[0.5em] text-onam-cream/70 sm:text-base"
              : "title-presents-in text-xl uppercase tracking-[0.5em] text-onam-cream sm:text-2xl"
          }
        >
          {titleHook.presentedBy}
        </p>

        {revealed && (
          <div className="flex flex-col items-center gap-4">
            <span className="title-heading-in text-shimmer text-[8rem] font-black leading-none drop-shadow-[0_0_70px_rgba(232,181,69,0.55)] sm:text-[11rem]">
              {titleHook.heading}
            </span>
            <p className="date-reveal-label text-lg uppercase tracking-[0.4em] text-onam-gold/80 sm:text-xl">
              {titleHook.subheading}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
