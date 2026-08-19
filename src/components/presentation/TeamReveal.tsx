"use client";

import { useState } from "react";
import type { Team, onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Fireworks from "@/components/effects/Fireworks";
import ChendaBeat from "@/components/effects/ChendaBeat";
import Particles from "@/components/effects/Particles";
import Petals from "@/components/effects/Petals";
import Confetti from "@/components/effects/Confetti";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";
import SpotlightSweep from "@/components/effects/SpotlightSweep";
import type { MotifType } from "@/components/effects/OnamMotifs";

/** All available motifs, rotated per team so each reveal gets a fresh-feeling spread instead of the same four every time. */
const ALL_MOTIFS: MotifType[] = [
  "chenda",
  "pulikali",
  "lamp",
  "pookalam",
  "leaf",
  "boat",
  "thiruvathira",
  "sadya",
];

function motifsForTeam(index: number): MotifType[] {
  const offset = (index * 2) % ALL_MOTIFS.length;
  return ALL_MOTIFS.map((_, i) => ALL_MOTIFS[(i + offset) % ALL_MOTIFS.length]);
}

type TeamRevealProps = {
  teams: Team[];
  stepMs: number;
  outroMs: number;
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  paused: boolean;
  onComplete: () => void;
  onIndexChange?: (index: number) => void;
};

const CORNERS = [
  { position: "top-6 left-6", textAlign: "text-left" },
  { position: "top-6 right-6", textAlign: "text-right" },
  { position: "bottom-6 left-6", textAlign: "text-left" },
  { position: "bottom-6 right-6", textAlign: "text-right" },
] as const;

export default function TeamReveal({
  teams,
  stepMs,
  outroMs,
  motifImages,
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

  const revealedTeams = teams.slice(0, index + 1);

  return (
    <div className="onam-stage scene-enter flex flex-col items-center justify-center overflow-hidden">
      <div className="light-rays" />
      <RangoliGlow />
      <Particles density={26} paused={paused} />
      <Petals density={14} paused={paused} />
      <Confetti density={20} burstTrigger={`${index}`} paused={paused} />
      <Fireworks burstTrigger={`${index}`} paused={paused} />
      <ChendaBeat beatTrigger={`${index}`} paused={paused} />
      <SpotlightSweep triggerKey={`${index}`} />
      <OnamMotifField types={motifsForTeam(index)} count={6} imageSrcs={motifImages} />

      <p className="absolute top-16 z-10 text-sm uppercase tracking-[0.6em] text-onam-gold/70">
        Meet The Teams
      </p>

      {revealedTeams.map((team, teamIndex) => {
        const corner = CORNERS[teamIndex % CORNERS.length];
        const isActive = teamIndex === index;
        return (
          <div
            key={team.name}
            className={`team-corner-in absolute ${corner.position} z-10 w-[min(26rem,calc(100vw-3rem))] rounded-[2rem] border bg-black/38 p-5 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:w-[24rem] ${
              isActive ? "border-onam-gold/45" : "border-onam-gold/18"
            }`}
          >
            <div
              className={`glow-orb h-48 w-48 opacity-70 ${isActive ? "opacity-80" : "opacity-50"}`}
              style={{ top: "-2.5rem", left: "-2rem" }}
            />
            <p
              className={`relative z-10 text-xs uppercase tracking-[0.7em] ${
                isActive ? "text-onam-cream/95" : "text-onam-gold/75"
              } ${corner.textAlign}`}
            >
              Team {teamIndex + 1}
            </p>
            <h2
              className={`relative z-10 mt-2 text-3xl font-black uppercase leading-tight tracking-[0.12em] sm:text-4xl ${
                corner.textAlign
              } ${isActive ? "text-onam-cream drop-shadow-[0_0_24px_rgba(232,181,69,0.35)]" : "text-onam-cream/85"}`}
            >
              {team.name}
            </h2>
          </div>
        );
      })}

      <div className="absolute bottom-14 z-10 flex gap-3">
        {teams.map((t, i) => (
          <span
            key={t.name}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${i <= index ? "w-8 bg-onam-gold" : "bg-onam-gold/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
