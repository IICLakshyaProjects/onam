"use client";

import { useState } from "react";
import type { onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Fireworks from "@/components/effects/Fireworks";
import Particles from "@/components/effects/Particles";
import Petals from "@/components/effects/Petals";

type DateRevealProps = {
  dateReveal: (typeof onamConfig)["dateReveal"];
  buildupMs: number;
  holdMs: number;
  paused: boolean;
  onComplete: () => void;
};

export default function DateReveal({ dateReveal, buildupMs, holdMs, paused, onComplete }: DateRevealProps) {
  const [phase, setPhase] = useState<0 | 1>(0);

  usePausableSequence(
    [buildupMs, holdMs],
    (index) => setPhase(index as 0 | 1),
    onComplete,
    paused,
    "date-reveal"
  );

  const revealed = phase === 1;

  return (
    <div className="onam-stage scene-enter flex flex-col items-center justify-center">
      <div className="light-rays" />
      <Particles density={revealed ? 55 : 24} paused={paused} />
      <Petals density={revealed ? 20 : 10} paused={paused} />
      <Fireworks auto={revealed} autoIntervalMs={900} paused={paused} />

      {!revealed ? (
        <div className="date-buildup-pulse relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="glow-orb h-72 w-72" />
          <p className="relative z-10 text-sm uppercase tracking-[0.6em] text-onam-gold/70">
            {dateReveal.line1}
          </p>
          <p className="relative z-10 text-2xl uppercase tracking-[0.4em] text-onam-cream/60">
            The Moment Approaches
          </p>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="glow-orb h-[42rem] w-[42rem]" />
          <p className="date-reveal-label relative z-10 text-base uppercase tracking-[0.6em] text-onam-gold/80 sm:text-lg">
            {dateReveal.line1}
          </p>
          <p className="date-reveal-label relative z-10 text-3xl font-bold uppercase tracking-[0.5em] text-onam-cream sm:text-4xl">
            {dateReveal.month}
          </p>
          <span className="date-reveal-day text-shimmer relative z-10 text-[14rem] font-black leading-none drop-shadow-[0_0_80px_rgba(232,181,69,0.6)] sm:text-[20rem]">
            {dateReveal.day}
          </span>
          <p className="date-reveal-label relative z-10 text-2xl font-semibold uppercase tracking-[0.4em] text-onam-gold/90 sm:text-3xl">
            {dateReveal.line2}
          </p>
        </div>
      )}
    </div>
  );
}
