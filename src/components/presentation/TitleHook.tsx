"use client";

import { useState } from "react";
import type { onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Petals from "@/components/effects/Petals";
import Confetti from "@/components/effects/Confetti";
import Particles from "@/components/effects/Particles";
import { ChendaMotif, LampMotif, PookalamMotif, LeafMotif } from "@/components/effects/OnamMotifs";

type TitleHookProps = {
  titleHook: (typeof onamConfig)["titleHook"];
  presentedByMs: number;
  headingMs: number;
  paused: boolean;
  onComplete: () => void;
};

/**
 * Opening hook shown before the previous-year video: a presenter credit
 * ("IIC Lakshya Presents") that settles into a small caption, then the main
 * title bursts in — over a softly animated backdrop of traditional Onam
 * motifs (chenda, lamp, pookalam, leaf) drifting behind the text.
 */
export default function TitleHook({ titleHook, presentedByMs, headingMs, paused, onComplete }: TitleHookProps) {
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
      <Particles density={30} paused={paused} />
      <Petals density={16} paused={paused} />
      <Confetti density={14} burstTrigger={revealed ? "revealed" : undefined} paused={paused} />

      {/* Drifting Onam motifs — kept to the edges so they never fight the text. */}
      <ChendaMotif className="floaty absolute left-[6%] top-[16%] h-20 w-20 text-onam-gold/25 sm:h-28 sm:w-28" />
      <LampMotif className="floaty-alt absolute right-[8%] top-[20%] h-24 w-24 text-onam-amber/25 sm:h-32 sm:w-32" />
      <PookalamMotif className="floaty absolute left-[10%] bottom-[14%] h-20 w-20 text-onam-crimson/25 sm:h-28 sm:w-28" />
      <LeafMotif className="floaty-alt absolute right-[10%] bottom-[18%] h-24 w-24 text-onam-green/30 sm:h-32 sm:w-32" />
      <ChendaMotif className="floaty-alt absolute right-[22%] top-[8%] hidden h-16 w-16 text-onam-gold/15 md:block" />
      <PookalamMotif className="floaty absolute left-[24%] bottom-[8%] hidden h-16 w-16 text-onam-cream/15 md:block" />

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
