/**
 * Shared Onam colour language used by both CSS (globals.css) and canvas-based
 * effects (fireworks / petals / particles). Keep these in sync with the
 * `--onam-*` custom properties in globals.css.
 */
export const ONAM_COLORS = {
  maroon: "#5c1220",
  deepRed: "#8a1220",
  crimson: "#b3222f",
  green: "#0e4a34",
  gold: "#e8b545",
  amber: "#d98f2b",
  cream: "#f6e8c9",
} as const;

/** Colour pool used for petal + firework particles (skips the darkest tones so they read against a dark stage). */
export const PARTICLE_PALETTE = [
  ONAM_COLORS.gold,
  ONAM_COLORS.amber,
  ONAM_COLORS.crimson,
  ONAM_COLORS.cream,
  ONAM_COLORS.green,
] as const;

export function randomPaletteColor(): string {
  return PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)];
}
