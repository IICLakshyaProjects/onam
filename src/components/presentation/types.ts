export type Scene =
  | "title"
  | "previous-video"
  | "post-video-credit"
  | "revile-video"
  | "countdown"
  | "poster"
  | "programs"
  | "teams"
  | "team-video"
  | "date"
  | "finished";

/** Canonical order the presentation moves through. `finished` is a terminal state, not part of the loop. */
export const SCENE_ORDER: Scene[] = [
  "title",
  "previous-video",
  "post-video-credit",
  "revile-video",
  "programs",
  "teams",
  "team-video",
  "date",
];

export type PresentationState = {
  currentScene: Scene;
  currentProgram: number;
  currentTeam: number;
  countdownValue: number;
  paused: boolean;
  /** Bumped on every restart so keyed scene components remount and timers start clean. */
  runId: number;
};
