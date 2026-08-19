"use client";

import { useEffect, useRef, useState } from "react";
import type { Program, onamConfig } from "@/config/onam";
import { usePausableSequence } from "@/lib/usePausableSequence";
import Petals from "@/components/effects/Petals";
import Particles from "@/components/effects/Particles";
import Confetti from "@/components/effects/Confetti";
import Fireworks from "@/components/effects/Fireworks";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";
import SpotlightSweep from "@/components/effects/SpotlightSweep";

type ProgramsRevealProps = {
  programs: Program[];
  sectionBreakIndex: number;
  bgmSrc: string;
  introMs: number;
  bridgeMs: number;
  stepMs: number;
  outroMs: number;
  motifImages: (typeof onamConfig)["media"]["motifImages"];
  paused: boolean;
  onComplete: () => void;
  onIndexChange?: (index: number) => void;
};

const ENTRANCE_VARIANTS = ["reveal-rise", "reveal-slide-left", "reveal-slide-right", "reveal-zoom"] as const;
const INTRO_ITEMS = ["REEL COMPETATION", "POOKALAM", "THIRUVATHIRA", "CHEND MELAM"] as const;
const BRIDGE_ITEMS = ["Onam Sadhya", "Photoshoot Session", "Outdoor Games"] as const;

export default function ProgramsReveal({
  programs,
  sectionBreakIndex,
  bgmSrc,
  introMs,
  bridgeMs,
  stepMs,
  outroMs,
  motifImages,
  paused,
  onComplete,
  onIndexChange,
}: ProgramsRevealProps) {
  const [index, setIndex] = useState(0);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const displayPrograms = programs.filter((program) => program.title !== "Chenda Melam");

  const culturalCount = Math.max(0, Math.min(sectionBreakIndex, displayPrograms.length));
  const eventCount = Math.max(0, displayPrograms.length - culturalCount);
  const introListStartIndex = 1;
  const introListEndIndex = introListStartIndex + INTRO_ITEMS.length - 1;
  const cultureHeadingIndex = introListEndIndex + 1;
  const culturalProgramStartIndex = cultureHeadingIndex + 1;
  const bridgeHeadingIndex = culturalProgramStartIndex + culturalCount;
  const bridgeItemStartIndex = bridgeHeadingIndex + 1;
  const bridgeItemEndIndex = bridgeItemStartIndex + BRIDGE_ITEMS.length - 1;
  const eventProgramStartIndex = bridgeItemEndIndex + 1;

  const durations =
    programs.length === 0
      ? [introMs]
      : [
          introMs,
          stepMs,
          ...INTRO_ITEMS.map(() => stepMs),
          ...programs.slice(0, culturalCount).map(() => stepMs),
          bridgeMs,
          ...BRIDGE_ITEMS.map(() => stepMs),
          ...programs.slice(culturalCount).map((_, i) => (i === eventCount - 1 ? stepMs + outroMs : stepMs)),
        ];

  usePausableSequence(
    durations,
    (i) => {
      setIndex(i);
      if (i >= culturalProgramStartIndex && i < eventProgramStartIndex) {
        onIndexChange?.(i - culturalProgramStartIndex);
      } else if (i >= eventProgramStartIndex) {
        onIndexChange?.(i - eventProgramStartIndex);
      }
    },
    onComplete,
    paused,
    `programs-${programs.length}-${sectionBreakIndex}-${introMs}-${bridgeMs}-${stepMs}`
  );

  const showingIntro = index === 0;
  const showingIntroItem = index >= introListStartIndex && index <= introListEndIndex;
  const showingCultureHeading = index === cultureHeadingIndex;
  const showingBridgeHeading = index === bridgeHeadingIndex;
  const showingBridgeItem = index >= bridgeItemStartIndex && index <= bridgeItemEndIndex;
  const culturalProgramIndex = Math.max(0, index - culturalProgramStartIndex);
  const eventProgramIndex = Math.max(0, index - eventProgramStartIndex);
  const program =
    index >= culturalProgramStartIndex && index < bridgeHeadingIndex
      ? displayPrograms[culturalProgramIndex]
      : index >= eventProgramStartIndex
        ? displayPrograms[eventProgramIndex]
        : undefined;
  const variant =
    ENTRANCE_VARIANTS[
      (showingBridgeHeading
        ? eventProgramIndex
        : showingBridgeItem
          ? index - bridgeItemStartIndex
        : index >= eventProgramStartIndex
          ? eventProgramIndex
          : index >= culturalProgramStartIndex
            ? culturalProgramIndex
          : index - 1) % ENTRANCE_VARIANTS.length
    ];
  const showingEventPhase = index >= eventProgramStartIndex;

  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;

    const startAt = 0;
    const primeAndPlay = () => {
      audio.volume = 0.12;
      if (audio.currentTime < startAt || audio.currentTime > startAt + 0.5) {
        audio.currentTime = startAt;
      }
      audio.play().catch(() => {});
    };

    const onLoadedMetadata = () => {
      primeAndPlay();
    };

    if (audio.readyState >= 1) {
      primeAndPlay();
    } else {
      audio.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.pause();
    };
  }, [bgmSrc]);

  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;

    if (paused) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [paused]);

  return (
    <div className="onam-stage scene-enter flex flex-col items-center justify-center">
      <audio ref={bgmRef} src={bgmSrc} preload="auto" />
      <div className="light-rays" />
      <div className="glow-orb h-[36rem] w-[36rem]" />
      <RangoliGlow />
      <SpotlightSweep triggerKey={index} />
      <Particles density={24} paused={paused} />
      <Petals density={16} paused={paused} />
      <Confetti density={18} burstTrigger={index} paused={paused} />
      <Fireworks burstTrigger={index} paused={paused} />
      <OnamMotifField types={["thiruvathira", "leaf", "boat", "sadya", "pookalam", "chenda"]} count={6} imageSrcs={motifImages} />

      <p className="absolute top-16 z-10 text-sm uppercase tracking-[0.6em] text-onam-gold/70">
        Programs &amp; Events
      </p>

      {showingIntro ? (
        <div className="reveal-rise relative z-10 flex max-w-4xl flex-col items-center px-10 text-center">
          <div className="mt-8 min-h-24 flex items-center justify-center">
            <h2 className="title-heading-in text-shimmer text-6xl font-black uppercase tracking-[0.2em] sm:text-8xl">
              ONAM Programs
            </h2>
          </div>
        </div>
      ) : showingIntroItem ? (
        <div className="reveal-rise relative z-10 flex max-w-4xl flex-col items-center px-10 text-center">
          {/* <p className="text-sm uppercase tracking-[0.7em] text-onam-cream/70">ONAM Programs</p> */}
          <div className="mt-8 min-h-24 flex items-center justify-center">
            <span className="title-heading-in text-shimmer text-4xl font-black uppercase tracking-[0.28em] sm:text-6xl">
              {INTRO_ITEMS[index - introListStartIndex]}
            </span>
          </div>
        </div>
      ) : showingCultureHeading ? (
        <div className="reveal-rise relative z-10 flex max-w-4xl flex-col items-center gap-6 px-10 text-center">
          <h2 className="title-heading-in text-shimmer text-6xl font-black uppercase tracking-[0.2em] sm:text-8xl">
            Our Cultural Events
          </h2>
        </div>
      ) : showingBridgeHeading ? (
        <div className="reveal-rise relative z-10 flex max-w-4xl flex-col items-center gap-6 px-10 text-center">
          <p className="text-sm uppercase tracking-[0.7em] text-onam-cream/70">Following this event</p>
          <h2 className="text-shimmer text-5xl font-black uppercase tracking-wide sm:text-7xl">We will be having</h2>
        </div>
      ) : showingBridgeItem ? (
        <div className="reveal-rise relative z-10 flex max-w-4xl flex-col items-center px-10 text-center">
          <p className="text-sm uppercase tracking-[0.7em] text-onam-cream/70">Following this event</p>
          <div className="mt-8 min-h-24 flex items-center justify-center">
            <span className="title-heading-in text-shimmer text-4xl font-black uppercase tracking-[0.28em] sm:text-6xl">
              {BRIDGE_ITEMS[index - bridgeItemStartIndex]}
            </span>
          </div>
        </div>
      ) : program ? (
        <div
          key={showingEventPhase ? eventProgramIndex : culturalProgramIndex}
          className={`${variant} relative z-10 flex max-w-4xl flex-col items-center gap-8 px-10 text-center`}
        >
          <div className="glow-orb h-64 w-64" style={{ top: "-2rem" }} />
          <div className="relative z-10 text-onam-gold">{renderProgramIcon(program.icon)}</div>
          <h2 className="text-shimmer relative z-10 text-6xl font-black uppercase tracking-wide sm:text-7xl">
            {program.title}
          </h2>
          <p className="relative z-10 max-w-2xl text-xl text-onam-cream/80 sm:text-2xl">{program.description}</p>
        </div>
      ) : null}

      {!showingIntro && !showingBridgeHeading && !showingBridgeItem && (
        <div className="absolute bottom-14 z-10 flex gap-3">
          {displayPrograms.map((p, i) => (
            <span
              key={p.title}
              className={`h-2 w-2 rounded-full transition-all duration-500 ${
                i === (showingEventPhase ? eventProgramIndex : culturalProgramIndex) ? "w-8 bg-onam-gold" : "bg-onam-gold/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function renderProgramIcon(icon: string) {
  const common = "h-16 w-16";
  switch (icon) {
    case "groupDance":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M16 48c4-10 10-16 16-16s12 6 16 16" strokeLinecap="round" />
          <path d="M24 20c0 4 3 8 8 8s8-4 8-8-3-8-8-8-8 4-8 8Z" />
          <path d="M20 42l-6 8M44 42l6 8" strokeLinecap="round" />
        </svg>
      );
    case "soloDance":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="32" cy="16" r="5" fill="currentColor" />
          <path d="M32 21v16M24 30l8 4 8-4M28 37l-8 12M36 37l8 12" strokeLinecap="round" />
        </svg>
      );
    case "groupSong":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M14 42c4-6 8-9 18-9s14 3 18 9" strokeLinecap="round" />
          <path d="M20 18v22M44 18v22" />
          <circle cx="20" cy="14" r="4" fill="currentColor" />
          <circle cx="44" cy="14" r="4" fill="currentColor" />
        </svg>
      );
    case "soloSong":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M30 12v28c0 5-4 8-9 8s-9-3-9-8 4-8 9-8c3 0 6 1 9 3V12h18v8H30" />
        </svg>
      );
    case "sreemanMalayalaManka":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 48c4-10 10-16 14-16s10 6 14 16" strokeLinecap="round" />
          <path d="M22 22c0 6 4 10 10 10s10-4 10-10-4-10-10-10-10 4-10 10Z" />
          <path d="M16 54h32" strokeLinecap="round" />
        </svg>
      );
    case "sreemanSolo":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="32" cy="18" r="6" fill="currentColor" />
          <path d="M32 24v20M24 34l8 6 8-6M28 44h8" strokeLinecap="round" />
        </svg>
      );
    case "malayalaMankaSolo":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 20c0-4 4-8 10-8s10 4 10 8-4 8-10 8-10-4-10-8Z" />
          <path d="M32 28v22M24 38c4 2 8 2 16 0M26 50h12" strokeLinecap="round" />
        </svg>
      );
    case "instrumental":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 42l18-18 8 8-18 18H12z" />
          <path d="M32 22l10-10M40 14l10 10" strokeLinecap="round" />
          <path d="M18 48l-6 6M26 56l6-6" strokeLinecap="round" />
        </svg>
      );
    case "chendaMelam":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="32" cy="20" r="8" />
          <path d="M20 34c4-4 8-6 12-6s8 2 12 6" strokeLinecap="round" />
          <path d="M24 42l-6 10M40 42l6 10" strokeLinecap="round" />
        </svg>
      );
    case "sadya":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 40c4-10 12-16 20-16s16 6 20 16" strokeLinecap="round" />
          <path d="M16 40h32" strokeLinecap="round" />
          <path d="M20 28h24M24 20h16" strokeLinecap="round" />
        </svg>
      );
    case "photoshoot":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="14" y="20" width="36" height="24" rx="4" />
          <circle cx="32" cy="32" r="8" />
          <path d="M20 16h8M36 16h8" strokeLinecap="round" />
        </svg>
      );
    case "outdoorGames":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 48c4-8 10-12 20-12s16 4 20 12" strokeLinecap="round" />
          <path d="M22 24c0 4 3 8 10 8s10-4 10-8-3-8-10-8-10 4-10 8Z" />
          <path d="M22 36l-8 10M42 36l8 10" strokeLinecap="round" />
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
