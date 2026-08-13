type RangoliGlowProps = {
  className?: string;
};

/**
 * A soft, slowly pulsing ring of colour anchored to the bottom of the stage —
 * evokes a pookalam (flower-carpet rangoli) glowing on the floor without
 * drawing an actual pattern. Pure CSS, zero JS, safe to drop into any scene.
 */
export default function RangoliGlow({ className }: RangoliGlowProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-[-14%] z-0 flex justify-center ${className ?? ""}`}
    >
      <div
        className="rangoli-pulse h-[34rem] w-[34rem] rounded-full sm:h-[42rem] sm:w-[42rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(179,34,47,0.32) 0%, rgba(232,181,69,0.24) 32%, rgba(14,74,52,0.18) 58%, transparent 76%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
