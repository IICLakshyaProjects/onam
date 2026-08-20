"use client";

import { useCallback, useState } from "react";
import OnamCurtainIntro from "@/components/effects/OnamCurtainIntro";
import OnamPresentation from "@/components/presentation/OnamPresentation";

/**
 * Root experience shell: the presentation runs immediately underneath
 * while the curtain intro plays once on top, then unmounts cleanly.
 */
export default function OnamExperience() {
  const [curtainDone, setCurtainDone] = useState(false);
  const handleCurtainComplete = useCallback(() => setCurtainDone(true), []);

  return (
    <>
      <OnamPresentation />
      {!curtainDone && <OnamCurtainIntro onComplete={handleCurtainComplete} />}
    </>
  );
}
