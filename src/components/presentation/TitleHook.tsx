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
  introMs: number;
  lookbackMs: number;
  paused: boolean;
  onComplete: () => void;
};

const ALL_MOTIFS = ["chenda", "pulikali", "lamp", "pookalam", "leaf", "boat", "thiruvathira", "sadya"] as const;

/**
 * Opening hook shown before the previous-year video: a presenter credit,
 * the main title, an intro line, and then a final look-back title before
 * transitioning into the video scene.
 */
export default function TitleHook({
  titleHook,
  motifImages,
  presentedByMs,
  headingMs,
  introMs,
  lookbackMs,
  paused,
  onComplete,
}: TitleHookProps) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  usePausableSequence(
    [presentedByMs, headingMs, introMs, lookbackMs],
    (index) => setPhase(index as 0 | 1 | 2 | 3),
    onComplete,
    paused,
    "title-hook"
  );

  const revealed = phase >= 1;

  return (
    <div className="onam-stage scene-enter flex flex-col items-center justify-center overflow-hidden">
      {/* Layered Onam festival backdrop - mandala, garlands, lamps, waves */}
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

      {/* All eight motifs - large and vivid so they read over the backdrop */}
      <OnamMotifField
        types={[...ALL_MOTIFS]}
        count={8}
        size="large"
        vivid
        imageSrcs={motifImages}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {phase === 0 && (
          <p className="title-presents-in text-xl uppercase tracking-[0.5em] text-onam-cream sm:text-2xl">
            {titleHook.presentedBy}
          </p>
        )}

        {phase === 1 && (
          <div className="flex flex-col items-center gap-4">
            <span className="title-heading-in text-shimmer text-[8rem] font-black leading-none drop-shadow-[0_0_70px_rgba(232,181,69,0.55)] sm:text-[11rem]">
              {titleHook.heading}
            </span>
          </div>
        )}

        {phase === 2 && (
          <p className="date-reveal-label max-w-4xl px-6 text-center text-2xl leading-tight text-onam-cream/90 sm:text-4xl normal-case tracking-normal">
            {titleHook.introCopy}
          </p>
        )}

        {phase === 3 && (
          <span className="title-heading-in text-shimmer px-6 text-center text-5xl font-black leading-tight sm:text-7xl">
            {titleHook.lookbackTitle}
          </span>
        )}

      </div>
    </div>
  );
}
