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

  /** Opening hook shown before the previous-year video. */
  titleHook: {
    introCopy: "HI Lakshya......... Before we celebrate this year, let\u2019s revisit the moments that made last Onam unforgettable\u2026",
    lookbackTitle: "A Look Back at Lakshyaarav 2K25",
  },

  /** Short credit card shown after the first video finishes. */
  postVideoCredit: {
    presentedBy: "Now here IIC Lakshya Presents",
  },

  media: {
    // Hosted remotely (the local /public/media/previous-onam.mp4 copy was removed).
    // Swap back to a local "/media/previous-onam.mp4" path any time by dropping the file in public/media/.
    previousYearVideo: "https://lakshyamailerimages.s3.ap-south-1.amazonaws.com/Lakshyaarav+Promo+(1).mp4",
    revileVideo: "/media/onam%20video%20countdown.mp4",
    lastVideo: "/media/last.mp4",
    reelVideo: "/media/ONAM%20REEL%2001%20-%20Anandhu%20Ramesh.mp4",
    programsBgm: "/media/Onam%20Banger%20%20Baluccciii%20%20Himna%20Hilari%20%20Hinitha%20Hilary%20%20Chris%20Wayne%20%20Saina%20Music%20Indie.mp3",
    poster: "/media/onam-poster.png",
    // Leave empty unless you actually add real motif images under
    // /public/media/motifs/. The presentation uses the built-in vector
    // motifs by default, so an empty object avoids pointless 404 checks.
    motifImages: {},
  },

  /** Set to false to keep the presentation on the final date screen instead of looping. */
  loop: false,

  /** Index where the post-cultural event section begins. */
  programSectionBreakIndex: 8,

  durations: {
    /** How long the intro line is held before fading into the look-back title (ms). */
    titleIntroMs: 3600,
    /** How long the look-back title is held before moving on to the video (ms). */
    titleLookbackMs: 2400,
    /** How long the post-video credit card is held (ms). */
    postVideoCreditMs: 2400,
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
    /** How long the cultural programs intro screen holds before the list begins (ms). */
    programIntroMs: 2600,
    /** How long the post-cultural bridge screen holds before the event section begins (ms). */
    programBridgeMs: 3000,
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
      title: "Group Dance",
      description: "High-energy team dance performances celebrating rhythm, movement, and festival spirit.",
      icon: "groupDance",
    },
    {
      title: "Solo Dance",
      description: "Individual dance performances with stage presence, expression, and style.",
      icon: "soloDance",
    },
    {
      title: "Group Song",
      description: "Choral and ensemble singing that brings everyone together on one stage.",
      icon: "groupSong",
    },
    {
      title: "Solo Song",
      description: "A single voice taking the spotlight with melody, confidence, and emotion.",
      icon: "soloSong",
    },
    {
      title: "Sreeman & Malayala Manka",
      description: "The marquee cultural showcase celebrating tradition, grace, and stage presence.",
      icon: "sreemanMalayalaManka",
    },
    {
      title: "Sreeman - Individual / Solo Performance",
      description: "An individual showcase for Sreeman with performance, poise, and personality.",
      icon: "sreemanSolo",
    },
    {
      title: "Malayala Manka - Individual / Solo Performance",
      description: "An individual showcase for Malayala Manka with elegance and expression.",
      icon: "malayalaMankaSolo",
    },
    {
      title: "Instrumental Performance",
      description: "A musical performance driven by instruments, rhythm, and live energy.",
      icon: "instrumental",
    },
    {
      title: "Chenda Melam",
      description: "A powerful traditional percussion performance that brings energy to the stage.",
      icon: "chendaMelam",
    },
    {
      title: "Onam Sadhya",
      description: "A festive dining experience with the traditional Onam spread.",
      icon: "sadya",
    },
    {
      title: "Photoshoot Session",
      description: "A fun, stylish session to capture the celebration in memorable frames.",
      icon: "photoshoot",
    },
    {
      title: "Outdoor Games",
      description: "Exciting and energetic outdoor games that bring everyone into the action.",
      icon: "outdoorGames",
    },
  ] satisfies Program[],

  teams: [
    { name: "Pathalam Passengers", image: "/media/team-1.png" },
    { name: "Thrikkakara Appans", image: "/media/team-2.png" },
    { name: "ON അല്ലെ🔥🔥🔥", image: "/media/team-3.png" },
    { name: "Mahabali Mafia", image: "/media/team-4.png" },
  ] satisfies Team[],

  dateReveal: {
    month: "SEPTEMBER",
    day: "02",
    line1: "ONAM CELEBRATION",
    line2: "Get Ready!",
  },
};

export type OnamConfig = typeof onamConfig;
