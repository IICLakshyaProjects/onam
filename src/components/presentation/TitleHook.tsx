"use client";

import { useState } from "react";
import type { onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Petals from "@/components/effects/Petals";
import Confetti from "@/components/effects/Confetti";
import Particles from "@/components/effects/Particles";
import Fireworks from "@/components/effects/Fireworks";
import ChendaBeat from "@/components/effects/ChendaBeat";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";
import SpotlightSweep from "@/components/effects/SpotlightSweep";
import TitleBackdrop from "@/components/effects/TitleBackdrop";

type TitleHookProps = {
  titleHook: (typeof onamConfig)["titleHook"];
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  presentedByMs: number;
  headingMs: number;
  paused: boolean;
  onComplete: () => void;
};

const ALL_MOTIFS = ["chenda", "pulikali", "lamp", "pookalam", "leaf", "boat", "thiruvathira", "sadya"] as const;

/**
 * Opening hook shown before the previous-year video: a presenter credit
 * ("IIC Lakshya Presents") that settles into a small caption, then the main
 * title bursts in — over a richly layered Onam festival backdrop with
 * pookalam mandala, garlands, continuous crackers, and drifting motifs.
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
      {/* Layered Onam festival backdrop — mandala, garlands, lamps, waves */}
      <TitleBackdrop intense={revealed} />

      <div className="light-rays opacity-80" />
      <div className="glow-orb h-[42rem] w-[42rem]" style={{ top: "18%" }} />
      <div
        className="glow-orb h-[28rem] w-[28rem] opacity-60"
        style={{
          top: "auto",
          bottom: "8%",
          background: "radial-gradient(circle, rgba(179,34,47,0.35) 0%, transparent 70%)",
        }}
      />
      <RangoliGlow />
      <SpotlightSweep triggerKey={phase} />

      {/* Continuous ambient + burst effects */}
      <Particles density={revealed ? 55 : 38} paused={paused} />
      <Petals density={revealed ? 28 : 20} paused={paused} />
      <Confetti density={revealed ? 32 : 22} burstTrigger={phase} paused={paused} />
      <Fireworks
        burstTrigger={phase}
        auto
        autoIntervalMs={revealed ? 750 : 1400}
        paused={paused}
      />
      <ChendaBeat beatTrigger={phase} paused={paused} />

      {/* All eight motifs — large and vivid so they read over the backdrop */}
      <OnamMotifField
        types={[...ALL_MOTIFS]}
        count={8}
        size="large"
        vivid
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
