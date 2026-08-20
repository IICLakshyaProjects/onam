"use client";

import { useEffect, useState } from "react";
import { onamConfig } from "@/config/onam";
import type { Scene } from "@/components/presentation/types";
import ProgramsTeamsMusic from "@/components/presentation/ProgramsTeamsMusic";
import TitleHook from "@/components/presentation/TitleHook";
import PreviousYearVideo from "@/components/presentation/PreviousYearVideo";
import PostVideoCredit from "@/components/presentation/PostVideoCredit";
import CountdownScene from "@/components/presentation/CountdownScene";
import PosterReveal from "@/components/presentation/PosterReveal";
import ProgramsReveal from "@/components/presentation/ProgramsReveal";
import TeamReveal from "@/components/presentation/TeamReveal";
import DateReveal from "@/components/presentation/DateReveal";
import Fireworks from "@/components/effects/Fireworks";
import ChendaBeat from "@/components/effects/ChendaBeat";
import Particles from "@/components/effects/Particles";
import Petals from "@/components/effects/Petals";
import Confetti from "@/components/effects/Confetti";
import OnamMotifField from "@/components/effects/OnamMotifField";
import RangoliGlow from "@/components/effects/RangoliGlow";
import SpotlightSweep from "@/components/effects/SpotlightSweep";

type SceneRendererProps = {
  scene: Scene;
  runId: number;
  paused: boolean;
  onSceneComplete: () => void;
  onCountdownValueChange: (value: number) => void;
  onProgramIndexChange: (index: number) => void;
  onTeamIndexChange: (index: number) => void;
};

/**
 * Maps the current state-machine scene to its component, keyed by
 * `${scene}-${runId}` so a restart (bumped runId) or a scene change always
 * mounts a fresh instance — timers and animations start clean every time,
 * and the outgoing scene's effects/timers are torn down by React on unmount.
 */
export default function SceneRenderer({
  scene,
  runId,
  paused,
  onSceneComplete,
  onCountdownValueChange,
  onProgramIndexChange,
  onTeamIndexChange,
}: SceneRendererProps) {
  const key = `${scene}-${runId}`;
  const { media, durations, programs, teams, dateReveal, titleHook, postVideoCredit } = onamConfig;
  const shouldPlayProgramsMusic = scene === "programs" || scene === "teams" || scene === "finished";

  return (
    <>
      <ProgramsTeamsMusic
        src={media.programsBgm}
        active={shouldPlayProgramsMusic}
        paused={paused}
      />
      {renderScene()}
    </>
  );

  function renderScene() {
    switch (scene) {
    case "title":
      return (
        <TitleHook
          key={key}
          titleHook={titleHook}
          motifImages={media.motifImages}
          introMs={durations.titleIntroMs}
          lookbackMs={durations.titleLookbackMs}
          paused={paused}
          onComplete={onSceneComplete}
        />
      );

    case "previous-video":
      return (
        <PreviousYearVideo
          key={key}
          src={media.previousYearVideo}
          fallbackDurationMs={durations.previousVideoFallback}
          motifImages={media.motifImages}
          videoMode="original"
          paused={paused}
          onComplete={onSceneComplete}
        />
      );

    case "post-video-credit":
      return (
        <PostVideoCredit
          key={key}
          postVideoCredit={postVideoCredit}
          motifImages={media.motifImages}
          durationMs={durations.postVideoCreditMs}
          paused={paused}
          onComplete={onSceneComplete}
        />
      );

    case "reveal-video":
      return (
        <PreviousYearVideo
          key={key}
          src={media.revealVideo}
          fallbackDurationMs={durations.previousVideoFallback}
          motifImages={media.motifImages}
          videoMode="enlarged"
          paused={paused}
          onComplete={onSceneComplete}
        />
      );

    case "countdown":
      return (
        <CountdownScene
          key={key}
          seconds={durations.countdownSeconds}
          stepMs={durations.countdownStepMs}
          motifImages={media.motifImages}
          paused={paused}
          onComplete={onSceneComplete}
          onValueChange={onCountdownValueChange}
        />
      );

    case "poster":
      return (
        <PosterReveal
          key={key}
          src={media.poster}
          durationMs={durations.posterDuration}
          motifImages={media.motifImages}
          paused={paused}
          onComplete={onSceneComplete}
        />
      );

    case "programs":
      return (
        <ProgramsReveal
          key={key}
          programs={programs}
          sectionBreakIndex={onamConfig.programSectionBreakIndex}
          introMs={durations.programIntroMs}
          bridgeMs={durations.programBridgeMs}
          stepMs={durations.programStepMs}
          reelVideoSrcs={{
            left: media.reelVideo,
            center: media.reelVideoCenter,
            right: media.reelVideoRight,
          }}
          motifImages={media.motifImages}
          paused={paused}
          onComplete={onSceneComplete}
          onIndexChange={onProgramIndexChange}
        />
      );

    case "teams":
      return (
        <TeamReveal
          key={key}
          teams={teams}
          stepMs={durations.teamStepMs}
          outroMs={durations.teamsOutroMs}
          motifImages={media.motifImages}
          paused={paused}
          onComplete={onSceneComplete}
          onIndexChange={onTeamIndexChange}
        />
      );

    case "date":
      return (
        <DateReveal
          key={key}
          dateReveal={dateReveal}
          buildupMs={durations.dateBuildupMs}
          holdMs={durations.dateHoldMs}
          motifImages={media.motifImages}
          paused={paused}
          onComplete={onSceneComplete}
        />
      );

    case "finished":
      return (
        <ClosingReveal key={key} paused={paused} motifImages={media.motifImages} />
      );

    default:
      return null;
    }
  }
}

function ClosingReveal({
  paused,
  motifImages,
}: {
  paused: boolean;
  motifImages: (typeof onamConfig)["media"]["motifImages"];
}) {
  const [phase, setPhase] = useState<0 | 1>(0);

  useEffect(() => {
    const first = window.setTimeout(() => setPhase(1), 2400);
    return () => window.clearTimeout(first);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;

    const fadeDelay = window.setTimeout(() => {
      window.dispatchEvent(new Event("onam-closing-advance-visible"));
    }, 300);
    return () => window.clearTimeout(fadeDelay);
  }, [phase]);

  return (
    <div className="onam-stage scene-enter flex flex-col items-center justify-center">
      <div className="light-rays" />
      <div className="glow-orb h-[42rem] w-[42rem]" />
      <RangoliGlow />
      <SpotlightSweep triggerKey="finished" />
      <Particles density={24} paused={paused} />
      <Petals density={12} paused={paused} />
      <Confetti density={16} paused={paused} />
      <Fireworks auto autoIntervalMs={1800} paused={paused} />
      <ChendaBeat beatTrigger="finished" paused={paused} />
      <OnamMotifField
        types={["chenda", "pulikali", "lamp", "pookalam", "leaf", "boat"]}
        count={6}
        imageSrcs={motifImages}
      />
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        <p
          className={`max-w-5xl text-center text-2xl font-black uppercase tracking-[0.24em] sm:text-4xl ${
            phase === 0 ? "title-heading-in text-shimmer opacity-100" : "opacity-0 transition-opacity duration-700"
          }`}
        >
          And finally, you will be having an exciting surprise on the celebration day.
        </p>
        <p
          className={`mt-6 text-xl font-black tracking-[0.18em] sm:text-3xl ${
            phase === 0 ? "opacity-0 transition-opacity duration-700" : "title-heading-in text-shimmer opacity-100"
          }`}
        >
          അപ്പോ സെപ്റ്റംബർ 02-ന് കാണാം
        </p>
        <p
          className={`mt-8 text-5xl font-black uppercase tracking-[0.22em] sm:text-7xl ${
            phase === 1 ? "title-heading-in text-shimmer opacity-100" : "opacity-0 transition-opacity duration-700"
          }`}
        >
          Advance Happy Onam
        </p>
      </div>
    </div>
  );
}
