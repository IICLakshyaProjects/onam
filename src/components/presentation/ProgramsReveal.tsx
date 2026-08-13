"use client";

import { useState } from "react";
import type { Program, onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Petals from "@/components/effects/Petals";
import Particles from "@/components/effects/Particles";
import Confetti from "@/components/effects/Confetti";
import OnamMotifField from "@/components/effects/OnamMotifField";

type ProgramsRevealProps = {
  programs: Program[];
  stepMs: number;
  outroMs: number;
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  paused: boolean;
  onComplete: () => void;
  onIndexChange?: (index: number) => void;
};

const ENTRANCE_VARIANTS = ["reveal-rise", "reveal-slide-left", "reveal-slide-right", "reveal-zoom"];

export default function ProgramsReveal({
  programs,
  stepMs,
  outroMs,
  motifImages,
  paused,
  onComplete,
  onIndexChange,
}: ProgramsRevealProps) {
  const [index, setIndex] = useState(0);

  // Nothing configured — fall through on a single short beat rather than showing a blank stage.
  const durations =
    programs.length === 0
      ? [1]
      : programs.map((_, i) => (i === programs.length - 1 ? stepMs + outroMs : stepMs));

  usePausableSequence(
    durations,
    (i) => {
      setIndex(i);
      onIndexChange?.(i);
    },
    onComplete,
    paused,
    `programs-${programs.length}-${stepMs}`
  );

  if (programs.length === 0) return null;

  const program = programs[index];
  const variant = ENTRANCE_VARIANTS[index % ENTRANCE_VARIANTS.length];

  return (
    <div className="onam-stage scene-enter flex flex-col items-center justify-center">
      <div className="light-rays" />
      <Particles density={20} paused={paused} />
      <Petals density={14} paused={paused} />
      <Confetti density={16} burstTrigger={index} paused={paused} />
      <OnamMotifField types={["thiruvathira", "leaf", "boat", "sadya"]} count={4} imageSrcs={motifImages} />

      <p className="absolute top-16 z-10 text-sm uppercase tracking-[0.6em] text-onam-gold/70">
        Programs &amp; Events
      </p>

      <div key={index} className={`${variant} relative z-10 flex max-w-4xl flex-col items-center gap-8 px-10 text-center`}>
        <div className="glow-orb h-64 w-64" style={{ top: "-2rem" }} />
        <div className="relative z-10 text-onam-gold">{renderProgramIcon(program.icon)}</div>
        <h2 className="text-shimmer relative z-10 text-6xl font-black uppercase tracking-wide sm:text-7xl">
          {program.title}
        </h2>
        <p className="relative z-10 max-w-2xl text-xl text-onam-cream/80 sm:text-2xl">{program.description}</p>
      </div>

      <div className="absolute bottom-14 z-10 flex gap-3">
        {programs.map((p, i) => (
          <span
            key={p.title}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-onam-gold" : "bg-onam-gold/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function renderProgramIcon(icon: string) {
  const common = "h-16 w-16";
  switch (icon) {
    case "cultural":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M32 6c6 8 6 14 0 20-6-6-6-12 0-20Z" fill="currentColor" />
          <path d="M32 26v30M18 40c4 6 10 8 14 8s10-2 14-8" strokeLinecap="round" />
          <path d="M14 56h36" strokeLinecap="round" />
        </svg>
      );
    case "games":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="32" cy="32" r="20" />
          <path d="M12 32h40M32 12v40" strokeLinecap="round" />
          <path d="M18 18c8 6 20 6 28 0M18 46c8-6 20-6 28 0" />
        </svg>
      );
    case "activities":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="32" cy="32" r="6" fill="currentColor" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx="32"
              cy="18"
              rx="6"
              ry="10"
              transform={`rotate(${deg} 32 32)`}
              fill="currentColor"
              opacity="0.85"
            />
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className={common} fill="currentColor">
          <path d="M32 4l6.5 19.5H58L42 35l6 20-16-12-16 12 6-20L6 23.5h19.5Z" />
        </svg>
      );
  }
}
