"use client";

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
  const shouldPlayProgramsMusic = scene === "programs" || scene === "teams";

  return (
    <>
      <ProgramsTeamsMusic src={media.programsBgm} active={shouldPlayProgramsMusic} paused={paused} />
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

    case "revile-video":
      return (
        <PreviousYearVideo
          key={key}
          src={media.revileVideo}
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
          reelVideoSrc={media.reelVideo}
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

    case "team-video":
      return (
        <PreviousYearVideo
          key={key}
          src={media.lastVideo}
          fallbackDurationMs={durations.previousVideoFallback}
          motifImages={media.motifImages}
          videoMode="original"
          paused={paused}
          holdOnEnd
          onComplete={onSceneComplete}
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
        <div key={key} className="onam-stage scene-enter flex flex-col items-center justify-center">
          <div className="light-rays" />
          <div className="glow-orb h-[42rem] w-[42rem]" />
          <RangoliGlow />
          <SpotlightSweep triggerKey="finished" />
          <Particles density={48} paused={paused} />
          <Petals density={20} paused={paused} />
          <Confetti density={24} paused={paused} />
          <Fireworks auto autoIntervalMs={1400} paused={paused} />
          <ChendaBeat beatTrigger="finished" paused={paused} />
          <OnamMotifField
            types={["chenda", "pulikali", "lamp", "pookalam", "leaf", "boat"]}
            count={6}
            imageSrcs={media.motifImages}
          />
        </div>
      );

    default:
      return null;
    }
  }
}
