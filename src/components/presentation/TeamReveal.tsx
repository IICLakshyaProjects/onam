"use client";

import { useState } from "react";
import Image from "next/image";
import type { Team } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Fireworks from "@/components/effects/Fireworks";
import Particles from "@/components/effects/Particles";
import Petals from "@/components/effects/Petals";

type TeamRevealProps = {
  teams: Team[];
  stepMs: number;
  outroMs: number;
  paused: boolean;
  onComplete: () => void;
  onIndexChange?: (index: number) => void;
};

const ENTRANCE_VARIANTS = ["reveal-zoom", "reveal-slide-left", "reveal-slide-right", "reveal-rise"];

export default function TeamReveal({
  teams,
  stepMs,
  outroMs,
  paused,
  onComplete,
  onIndexChange,
}: TeamRevealProps) {
  const [index, setIndex] = useState(0);

  const durations =
    teams.length === 0 ? [1] : teams.map((_, i) => (i === teams.length - 1 ? stepMs + outroMs : stepMs));

  usePausableSequence(
    durations,
    (i) => {
      setIndex(i);
      onIndexChange?.(i);
    },
    onComplete,
    paused,
    `teams-${teams.length}-${stepMs}`
  );

  if (teams.length === 0) return null;

  const team = teams[index];
  const variant = ENTRANCE_VARIANTS[index % ENTRANCE_VARIANTS.length];

  return (
    <div className="onam-stage scene-enter flex flex-col items-center justify-center">
      <div className="light-rays" />
      <Particles density={26} paused={paused} />
      <Petals density={14} paused={paused} />
      <Fireworks burstTrigger={`${team.name}-${index}`} paused={paused} />

      <p className="absolute top-16 z-10 text-sm uppercase tracking-[0.6em] text-onam-gold/70">
        Meet The Teams
      </p>

      <div key={index} className={`${variant} relative z-10 flex flex-col items-center gap-8 px-10 text-center`}>
        <div className="glow-orb h-80 w-80" />
        <TeamPortrait team={team} />
        <h2 className="text-shimmer relative z-10 text-6xl font-black uppercase tracking-wide sm:text-7xl">
          {team.name}
        </h2>
        {team.tagline && (
          <p className="relative z-10 max-w-xl text-lg text-onam-cream/80 sm:text-xl">{team.tagline}</p>
        )}
      </div>

      <div className="absolute bottom-14 z-10 flex gap-3">
        {teams.map((t, i) => (
          <span
            key={t.name}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-onam-gold" : "bg-onam-gold/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TeamPortrait({ team }: { team: Team }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="relative z-10 flex h-64 w-64 items-center justify-center rounded-full border-4 border-onam-gold/60 bg-black/40 text-5xl font-black text-onam-gold sm:h-72 sm:w-72">
        {initials(team.name)}
      </div>
    );
  }

  return (
    <div className="relative z-10 h-64 w-64 overflow-hidden rounded-full border-4 border-onam-gold/60 shadow-[0_0_60px_rgba(232,181,69,0.4)] sm:h-72 sm:w-72">
      <Image
        src={team.image}
        alt={team.name}
        fill
        sizes="18rem"
        style={{ objectFit: "cover" }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
