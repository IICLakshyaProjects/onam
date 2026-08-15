type TitleBackdropProps = {
  /** When true (main title revealed), decorative layers pulse brighter. */
  intense?: boolean;
  className?: string;
};

/**
 * Rich Onam-themed background for the opening title hook — a rotating
 * pookalam mandala, corner lamp ornaments, marigold garlands, boat-wave
 * floor trim, twinkling sparkles and layered festival colour washes.
 * Pure CSS/SVG, no canvas — sits behind text and canvas effects.
 */
export default function TitleBackdrop({ intense = false, className }: TitleBackdropProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className ?? ""}`}
    >
      {/* Festival colour washes — maroon, gold, green (Onam tricolour feel) */}
      <div
        className={`absolute -left-[20%] top-[10%] h-[50rem] w-[50rem] rounded-full transition-opacity duration-1000 ${
          intense ? "opacity-50" : "opacity-30"
        }`}
        style={{
          background: "radial-gradient(circle, rgba(179,34,47,0.35) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className={`absolute -right-[15%] top-[25%] h-[44rem] w-[44rem] rounded-full transition-opacity duration-1000 ${
          intense ? "opacity-45" : "opacity-25"
        }`}
        style={{
          background: "radial-gradient(circle, rgba(14,74,52,0.4) 0%, transparent 65%)",
          filter: "blur(36px)",
        }}
      />
      <div
        className={`absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-1000 ${
          intense ? "opacity-55" : "opacity-35"
        }`}
        style={{
          background: "radial-gradient(circle, rgba(232,181,69,0.28) 0%, transparent 58%)",
          filter: "blur(28px)",
        }}
      />

      {/* Central pookalam mandala — two counter-rotating rings */}
      <svg
        viewBox="0 0 400 400"
        className={`title-mandala-outer absolute left-1/2 top-1/2 h-[min(92vw,52rem)] w-[min(92vw,52rem)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${
          intense ? "opacity-[0.38]" : "opacity-[0.22]"
        }`}
      >
        <g transform="translate(200 200)">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse
              key={`o-${deg}`}
              cx="0"
              cy="-148"
              rx="14"
              ry="28"
              fill="var(--onam-gold)"
              opacity="0.55"
              transform={`rotate(${deg})`}
            />
          ))}
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
            <ellipse
              key={`o2-${deg}`}
              cx="0"
              cy="-118"
              rx="10"
              ry="22"
              fill="var(--onam-crimson)"
              opacity="0.45"
              transform={`rotate(${deg})`}
            />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={`o3-${deg}`}
              cx="0"
              cy="-82"
              rx="8"
              ry="16"
              fill="var(--onam-green)"
              opacity="0.5"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="28" fill="var(--onam-amber)" opacity="0.7" />
          <circle r="14" fill="var(--onam-cream)" opacity="0.85" />
        </g>
      </svg>

      <svg
        viewBox="0 0 400 400"
        className={`title-mandala-inner absolute left-1/2 top-1/2 h-[min(68vw,38rem)] w-[min(68vw,38rem)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${
          intense ? "opacity-[0.32]" : "opacity-[0.18]"
        }`}
      >
        <g transform="translate(200 200)">
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
            (deg) => (
              <ellipse
                key={`i-${deg}`}
                cx="0"
                cy="-96"
                rx="7"
                ry="14"
                fill="var(--onam-gold)"
                opacity="0.6"
                transform={`rotate(${deg})`}
              />
            )
          )}
          <circle r="18" fill="var(--onam-crimson)" opacity="0.55" />
        </g>
      </svg>

      {/* Corner nilavilakku ornaments */}
      <CornerLamp className="title-corner-ornament left-4 top-4 sm:left-8 sm:top-8" flip={false} />
      <CornerLamp className="title-corner-ornament right-4 top-4 sm:right-8 sm:top-8" flip />
      <CornerLamp className="title-corner-ornament bottom-16 left-4 sm:bottom-20 sm:left-8" flip={false} />
      <CornerLamp className="title-corner-ornament bottom-16 right-4 sm:bottom-20 sm:right-8" flip />

      {/* Top marigold garland */}
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className={`title-garland absolute inset-x-0 top-0 h-16 w-full sm:h-20 ${intense ? "opacity-70" : "opacity-45"}`}
      >
        <path
          d="M0,40 Q150,10 300,40 T600,40 T900,40 T1200,40"
          fill="none"
          stroke="var(--onam-gold)"
          strokeWidth="2"
          opacity="0.5"
        />
        {Array.from({ length: 24 }, (_, i) => {
          const x = 25 + i * 48;
          const y = 40 + Math.sin(i * 0.85) * 12;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill="var(--onam-amber)" opacity="0.75" />
              <circle cx={x} cy={y} r="3.5" fill="var(--onam-cream)" opacity="0.9" />
            </g>
          );
        })}
      </svg>

      {/* Bottom boat-wave trim */}
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className={`title-boat-waves absolute inset-x-0 bottom-0 h-14 w-full sm:h-16 ${intense ? "opacity-60" : "opacity-40"}`}
      >
        <path
          d="M0,30 Q200,8 400,30 T800,30 T1200,30 L1200,60 L0,60 Z"
          fill="url(#titleWaveFill)"
          opacity="0.85"
        />
        <path
          d="M0,38 Q180,20 360,38 T720,38 T1200,38"
          fill="none"
          stroke="var(--onam-gold)"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <defs>
          <linearGradient id="titleWaveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(14,74,52,0.55)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Side vine borders */}
      <div className="title-vine-border absolute bottom-[12%] left-3 top-[14%] w-8 sm:left-6 sm:w-10" />
      <div className="title-vine-border absolute bottom-[12%] right-3 top-[14%] w-8 sm:right-6 sm:w-10" />

      {/* Twinkling festival sparkles */}
      <div className="title-sparkle-field absolute inset-0">
        {SPARKLE_SLOTS.map((s, i) => (
          <span
            key={i}
            className="title-sparkle absolute block h-1 w-1 rounded-full bg-onam-gold"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Occasional cracker-flash pops at corners */}
      <div className={`title-cracker-flash left-[8%] top-[18%] ${intense ? "title-cracker-flash-fast" : ""}`} />
      <div
        className={`title-cracker-flash right-[10%] top-[22%] ${intense ? "title-cracker-flash-fast" : ""}`}
        style={{ animationDelay: "1.4s" }}
      />
      <div
        className={`title-cracker-flash left-[12%] bottom-[24%] ${intense ? "title-cracker-flash-fast" : ""}`}
        style={{ animationDelay: "2.8s" }}
      />
      <div
        className={`title-cracker-flash right-[8%] bottom-[20%] ${intense ? "title-cracker-flash-fast" : ""}`}
        style={{ animationDelay: "0.7s" }}
      />
    </div>
  );
}

const SPARKLE_SLOTS = [
  { left: "12%", top: "28%", delay: 0, duration: 2.2 },
  { left: "88%", top: "32%", delay: 0.6, duration: 2.8 },
  { left: "22%", top: "62%", delay: 1.1, duration: 2.4 },
  { left: "78%", top: "58%", delay: 0.3, duration: 3.1 },
  { left: "45%", top: "18%", delay: 1.8, duration: 2.6 },
  { left: "55%", top: "72%", delay: 0.9, duration: 2.9 },
  { left: "6%", top: "48%", delay: 2.2, duration: 2.3 },
  { left: "94%", top: "44%", delay: 1.5, duration: 2.7 },
  { left: "32%", top: "38%", delay: 0.4, duration: 3.4 },
  { left: "68%", top: "42%", delay: 2.6, duration: 2.5 },
  { left: "18%", top: "78%", delay: 1.2, duration: 3.0 },
  { left: "82%", top: "76%", delay: 0.8, duration: 2.1 },
];

function CornerLamp({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`h-14 w-14 text-onam-gold/40 sm:h-20 sm:w-20 ${flip ? "scale-x-[-1]" : ""} ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M40 6c5 6 8 11 8 16a8 8 0 1 1-16 0c0-5 3-10 8-16Z" fill="currentColor" opacity="0.85" />
      <path d="M40 30v10" strokeLinecap="round" />
      <path d="M24 40h32l-3 8H27l-3-8Z" />
      <path d="M18 48h44l-5 20H23l-5-20Z" />
      <path d="M12 68h56" strokeLinecap="round" />
      {/* Decorative flourish */}
      <path d="M8 12 Q20 4 32 12 M48 12 Q60 4 72 12" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
