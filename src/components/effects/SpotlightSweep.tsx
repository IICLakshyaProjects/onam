type SpotlightSweepProps = {
  /** Change this value to replay the sweep (e.g. the team index). */
  triggerKey: string | number;
  className?: string;
};

/**
 * A single diagonal beam of light that sweeps once across the stage — like a
 * spotlight snapping onto a live announcement. Pure CSS, one-shot per
 * `triggerKey` change (remounts via `key`, so it always replays cleanly).
 */
export default function SpotlightSweep({ triggerKey, className }: SpotlightSweepProps) {
  return (
    <div
      key={triggerKey}
      aria-hidden
      className={`spotlight-sweep pointer-events-none absolute inset-0 z-0 ${className ?? ""}`}
    />
  );
}
