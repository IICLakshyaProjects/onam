"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import OnamCurtainIntro from "@/components/effects/OnamCurtainIntro";
import OnamPresentation from "@/components/presentation/OnamPresentation";

type CurtainPhase = "waiting" | "opening" | "done";

/**
 * Root experience shell: the presentation runs underneath the curtain but
 * stays paused until the curtain fully opens. All keyboard input is blocked
 * during the curtain so Enter cannot skip scenes underneath.
 */
export default function OnamExperience() {
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>("waiting");
  const [presentationRunId, setPresentationRunId] = useState(0);

  const handleCurtainComplete = useCallback(() => {
    setCurtainPhase("done");
    setPresentationRunId((id) => id + 1);
  }, []);

  useLayoutEffect(() => {
    if (curtainPhase === "done") return;

    const blockInteraction = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      blockInteraction(event);

      if (curtainPhase === "waiting" && event.key === "Enter") {
        setCurtainPhase("opening");
      }
    };

    const options: AddEventListenerOptions = { capture: true };
    window.addEventListener("keydown", handleKeyDown, options);
    window.addEventListener("pointerdown", blockInteraction, options);
    window.addEventListener("touchstart", blockInteraction, options);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, options);
      window.removeEventListener("pointerdown", blockInteraction, options);
      window.removeEventListener("touchstart", blockInteraction, options);
    };
  }, [curtainPhase]);

  const curtainActive = curtainPhase !== "done";

  return (
    <>
      <OnamPresentation
        key={presentationRunId}
        holdPlayback={curtainActive}
        controlsDisabled={curtainActive}
      />
      {curtainActive && (
        <OnamCurtainIntro opening={curtainPhase === "opening"} onComplete={handleCurtainComplete} />
      )}
    </>
  );
}
