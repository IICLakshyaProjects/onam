"use client";

import type { onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Particles from "@/components/effects/Particles";
import Petals from "@/components/effects/Petals";
import Confetti from "@/components/effects/Confetti";
import Fireworks from "@/components/effects/Fireworks";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";
import TitleBackdrop from "@/components/effects/TitleBackdrop";

type PostVideoCreditProps = {
  postVideoCredit: (typeof onamConfig)["postVideoCredit"];
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  durationMs: number;
  paused: boolean;
  onComplete: () => void;
};

const ALL_MOTIFS = ["chenda", "pulikali", "lamp", "pookalam", "leaf", "boat"] as const;

/**
 * Short bridge scene shown immediately after the first video finishes.
 */
export default function PostVideoCredit({
  postVideoCredit,
  motifImages,
  durationMs,
  paused,
  onComplete,
}: PostVideoCreditProps) {
  usePausableSequence([durationMs], () => {}, onComplete, paused, "post-video-credit");

  return (
    <div className="onam-stage scene-enter flex items-center justify-center overflow-hidden">
      <TitleBackdrop intense />
      <div className="light-rays opacity-70" />
      <div className="glow-orb h-[36rem] w-[36rem]" />
      <RangoliGlow />
      <Particles density={34} paused={paused} />
      <Petals density={16} paused={paused} />
      <Confetti density={18} paused={paused} />
      <Fireworks auto autoIntervalMs={1200} paused={paused} />
      <OnamMotifField types={[...ALL_MOTIFS]} count={6} size="large" vivid imageSrcs={motifImages} />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <p className="title-presents-in text-xl uppercase tracking-[0.5em] text-onam-cream sm:text-2xl">
          {postVideoCredit.presentedBy}
        </p>
      </div>
    </div>
  );
}
