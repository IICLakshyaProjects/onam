"use client";

import { useCallback, useState } from "react";
import { onamConfig } from "@/config/onam";
import { SCENE_ORDER, type PresentationState, type Scene } from "@/components/presentation/types";
import SceneRenderer from "@/components/presentation/SceneRenderer";
import PresentationControls from "@/components/controls/PresentationControls";

const INITIAL_STATE: PresentationState = {
  currentScene: "title",
  currentProgram: 0,
  currentTeam: 0,
  countdownValue: onamConfig.durations.countdownSeconds,
  paused: false,
  runId: 0,
};

/**
 * Presentation state machine. Owns the current scene, playback state and
 * the small pieces of "what's on screen right now" (countdown value,
 * program/team index) — every scene component is a pure function of these
 * plus its own internal timing, so there is exactly one source of truth for
 * where the show is and no scattered/duplicated timer logic.
 */
export default function OnamPresentation() {
  const [state, setState] = useState<PresentationState>(INITIAL_STATE);

  const goToScene = useCallback((scene: Scene) => {
    setState((prev) => ({ ...prev, currentScene: scene }));
  }, []);

  const jumpToSceneIndex = useCallback(
    (index: number) => {
      const scene = SCENE_ORDER[index];
      if (scene) goToScene(scene);
    },
    [goToScene]
  );

  const restartPresentation = useCallback(() => {
    setState((prev) => ({
      ...INITIAL_STATE,
      runId: prev.runId + 1,
    }));
  }, []);

  const nextScene = useCallback(() => {
    setState((prev) => {
      if (prev.currentScene === "finished") return prev;

      if (prev.currentScene === "teams") {
        return { ...prev, currentScene: "finished" };
      }

      const idx = SCENE_ORDER.indexOf(prev.currentScene);
      const isLast = idx === SCENE_ORDER.length - 1;

      if (!isLast) {
        return { ...prev, currentScene: SCENE_ORDER[idx + 1] };
      }

      if (onamConfig.loop) {
        return { ...INITIAL_STATE, runId: prev.runId + 1 };
      }
      return prev;
    });
  }, []);

  const previousScene = useCallback(() => {
    setState((prev) => {
      if (prev.currentScene === "finished") {
        return { ...prev, currentScene: SCENE_ORDER[SCENE_ORDER.length - 1] };
      }
      const idx = SCENE_ORDER.indexOf(prev.currentScene);
      const prevIdx = Math.max(0, idx - 1);
      return { ...prev, currentScene: SCENE_ORDER[prevIdx] };
    });
  }, []);

  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, paused: !prev.paused }));
  }, []);

  const setCountdownValue = useCallback((value: number) => {
    setState((prev) => (prev.countdownValue === value ? prev : { ...prev, countdownValue: value }));
  }, []);

  const setCurrentProgram = useCallback((index: number) => {
    setState((prev) => (prev.currentProgram === index ? prev : { ...prev, currentProgram: index }));
  }, []);

  const setCurrentTeam = useCallback((index: number) => {
    setState((prev) => (prev.currentTeam === index ? prev : { ...prev, currentTeam: index }));
  }, []);

  return (
    <>
      <SceneRenderer
        scene={state.currentScene}
        runId={state.runId}
        paused={state.paused}
        onSceneComplete={nextScene}
        onCountdownValueChange={setCountdownValue}
        onProgramIndexChange={setCurrentProgram}
        onTeamIndexChange={setCurrentTeam}
      />
      <PresentationControls
        onTogglePause={togglePause}
        onNext={nextScene}
        onPrevious={previousScene}
        onRestart={restartPresentation}
        onJumpToScene={jumpToSceneIndex}
      />
    </>
  );
}
