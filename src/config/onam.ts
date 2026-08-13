/**
 * Central configuration for the Onam Celebration presentation.
 *
 * Edit content, timings and media paths here without touching any
 * animation/state-machine logic.
 */

export type Program = {
  title: string;
  description: string;
  icon: string; // simple glyph/emoji-free icon key, rendered by ProgramsReveal
};

export type Team = {
  name: string;
  image: string;
  tagline?: string;
};

export const onamConfig = {
  event: {
    heading: "ONAM CELEBRATION",
    subheading: "A Golden Harvest of Togetherness",
    year: new Date().getFullYear().toString(),
  },

  /** Opening hook shown before the previous-year video — presenter credit, then the title. */
  titleHook: {
    presentedBy: "IIC Lakshya Presents",
    heading: "ONAM",
    subheading: "A Golden Harvest of Togetherness",
  },

  media: {
    // Hosted remotely (the local /public/media/previous-onam.mp4 copy was removed).
    // Swap back to a local "/media/previous-onam.mp4" path any time by dropping the file in public/media/.
    previousYearVideo: "https://lakshyamailerimages.s3.ap-south-1.amazonaws.com/Lakshyaarav+Promo+(1).mp4",
    poster: "/media/onam-poster.png",
  },

  /** Set to false to keep the presentation on the final date screen instead of looping. */
  loop: true,

  durations: {
    /** How long the "presented by" credit is held alone before the main title bursts in (ms). */
    titlePresentedByMs: 2600,
    /** How long the main title hook is held on screen before moving on to the video (ms). */
    titleHeadingMs: 4200,
    /** Fallback duration (ms) for the previous-year video scene if the video is missing / fails to load. */
    previousVideoFallback: 8000,
    /** Starting number for the countdown; it always counts all the way down through 0 (one visual beat per second). */
    countdownSeconds: 10,
    /** How long each countdown number is held on screen (ms). */
    countdownStepMs: 1000,
    /** How long the poster is displayed for (ms). */
    posterDuration: 8000,
    /** How long each program item takes to reveal + hold before the next one (ms). */
    programStepMs: 2600,
    /** Extra hold time (ms) once every program has been revealed. */
    programsOutroMs: 2200,
    /** How long each team reveal + firework burst holds before the next team (ms). */
    teamStepMs: 3200,
    /** Extra hold time (ms) once every team has been revealed. */
    teamsOutroMs: 1800,
    /** How long the build-up/pulse plays before the date itself appears (ms). */
    dateBuildupMs: 2600,
    /** How long the final date screen holds before looping/finishing (ms). */
    dateHoldMs: 8000,
    /** Crossfade duration used between scenes (ms). */
    sceneTransitionMs: 900,
  },

  programs: [
    {
      title: "Cultural",
      description: "Classical dance, music and traditional performances celebrating Kerala's heritage.",
      icon: "cultural",
    },
    {
      title: "Indoor / Outdoor",
      description: "Friendly team competitions and games for everyone to enjoy together.",
      icon: "games",
    },
    {
      title: "Activities",
      description: "Onam Sadya, Pookalam making and other festive activities through the day.",
      icon: "activities",
    },
  ] satisfies Program[],

  teams: [
    { name: "Team 1", image: "/media/team-1.png" },
    { name: "Team 2", image: "/media/team-2.png" },
    { name: "Team 3", image: "/media/team-3.png" },
    { name: "Team 4", image: "/media/team-4.png" },
  ] satisfies Team[],

  dateReveal: {
    month: "SEPTEMBER",
    day: "02",
    line1: "ONAM CELEBRATION",
    line2: "Get Ready!",
  },
};

export type OnamConfig = typeof onamConfig;
