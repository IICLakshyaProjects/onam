"use client";

import { useState } from "react";
import type { onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Petals from "@/components/effects/Petals";
import Particles from "@/components/effects/Particles";
import Confetti from "@/components/effects/Confetti";
import Fireworks from "@/components/effects/Fireworks";
import ChendaBeat from "@/components/effects/ChendaBeat";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";
import SpotlightSweep from "@/components/effects/SpotlightSweep";

type CountdownSceneProps = {
  seconds: number;
  stepMs: number;
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  paused: boolean;
  onComplete: () => void;
  onValueChange?: (value: number) => void;
};

export default function CountdownScene({
  seconds,
  stepMs,
  motifImages,
  paused,
  onComplete,
  onValueChange,
}: CountdownSceneProps) {
  const [stepIndex, setStepIndex] = useState(0);
  // Counts all the way down to (and including) 0 — seconds + 1 beats: 10, 9, ... 1, 0.
  const durations = Array.from({ length: seconds + 1 }, () => stepMs);
  const value = seconds - stepIndex;

  usePausableSequence(
    durations,
    (index) => {
      setStepIndex(index);
      onValueChange?.(seconds - index);
    },
    onComplete,
    paused,
    `countdown-${seconds}-${stepMs}`
  );

  return (
    <div className="onam-stage scene-enter flex items-center justify-center">
      <div className="light-rays" />
      <RangoliGlow />
      <SpotlightSweep triggerKey={stepIndex} />
      <Particles density={28} paused={paused} />
      <Petals density={18} paused={paused} />
      <Confetti density={20} burstTrigger={stepIndex} paused={paused} />
      <Fireworks burstTrigger={stepIndex} paused={paused} />
      <ChendaBeat beatTrigger={stepIndex} paused={paused} />
      <OnamMotifField
        types={["chenda", "pulikali", "lamp", "pookalam", "boat"]}
        count={5}
        imageSrcs={motifImages}
      />

      <p className="absolute top-16 z-10 text-sm uppercase tracking-[0.6em] text-onam-gold/70">
        Get Ready
      </p>

      <div className="relative z-10 flex items-center justify-center">
        <div
          key={`ring-${stepIndex}`}
          className="countdown-ring absolute h-[26rem] w-[26rem] rounded-full border-4 border-onam-gold/70"
        />
        <div
          key={`glow-${stepIndex}`}
          className="glow-orb h-[30rem] w-[30rem]"
        />
        <span
          key={stepIndex}
          className="countdown-number text-shimmer relative text-[13rem] font-black leading-none drop-shadow-[0_0_60px_rgba(232,181,69,0.5)] sm:text-[16rem]"
        >
          {value}
        </span>
      </div>
    </div>
  );
}
