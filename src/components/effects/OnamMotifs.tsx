/**
 * Small line-art silhouettes of traditional Onam motifs — a chenda (festival
 * drum), a nilavilakku (standing oil lamp), a pookalam (flower rangoli), a
 * banana leaf, a pulikali tiger face, a snake boat (vallam kali), a
 * thiruvathira dance circle and a sadya feast leaf. Original vector icons
 * (not photos), sized to sit quietly in a scene's background and animate
 * with the `.floaty*` CSS keyframes. See `OnamMotifField` for the component
 * that arranges these (or real photos, once supplied) around a scene.
 */

type MotifProps = {
  className?: string;
};

export function ChendaMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <ellipse cx="50" cy="24" rx="26" ry="9" />
      <ellipse cx="50" cy="76" rx="26" ry="9" />
      <path d="M24 24c-3 18-3 34 0 52M76 24c3 18 3 34 0 52" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x1 = 28 + i * 8.8;
        return <path key={i} d={`M${x1} 30 L${x1 + 4} 70`} strokeWidth="1.4" opacity="0.7" />;
      })}
    </svg>
  );
}

export function LampMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M50 8c6 8 10 14 10 20a10 10 0 1 1-20 0c0-6 4-12 10-20Z" fill="currentColor" opacity="0.9" />
      <path d="M50 38v14" strokeLinecap="round" />
      <path d="M30 52h40l-4 10H34l-4-10Z" />
      <path d="M38 62v6M62 62v6" />
      <path d="M26 68h48l-6 24H32l-6-24Z" />
      <path d="M20 92h60" strokeLinecap="round" />
    </svg>
  );
}

export function PookalamMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <circle cx="50" cy="50" r="8" opacity="0.9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="50" cy="24" rx="8" ry="15" transform={`rotate(${deg} 50 50)`} opacity="0.75" />
      ))}
    </svg>
  );
}

export function LeafMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M50 8c26 8 38 30 34 58-24 6-46-4-56-26C20 24 32 12 50 8Z" opacity="0.85" />
      <path d="M50 10c-4 26-4 50 6 78" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/** Stylized pulikali (tiger dance) face — rounded muzzle, stripes, a hint of mane. */
export function PulikaliMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M50 14c18 0 30 14 30 32 0 20-14 34-30 34S20 66 20 46c0-18 12-32 30-32Z" opacity="0.9" />
      <path d="M30 30c-6-6-12-8-18-6M70 30c6-6 12-8 18-6" strokeLinecap="round" />
      <circle cx="38" cy="42" r="3.5" fill="currentColor" />
      <circle cx="62" cy="42" r="3.5" fill="currentColor" />
      <path d="M50 52v8M42 66c3 3 5 4 8 4s5-1 8-4" strokeLinecap="round" />
      <path d="M26 50c6 2 10 2 14 0M74 50c-6 2-10 2-14 0M28 62c6 0 9-1 12-3M72 62c-6 0-9-1-12-3" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

/** Snake boat (vallam kali) — long curved hull with a raised, fan-like prow. */
export function BoatMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 66c14 12 74 12 88 0" strokeLinecap="round" />
      <path d="M6 66c4-10 12-16 20-16h48c8 0 16 6 20 16" strokeLinecap="round" />
      <path d="M78 50c8-10 10-22 6-34-10 6-16 16-16 30" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${28 + i * 11} 58v-8`} strokeLinecap="round" opacity="0.7" />
      ))}
    </svg>
  );
}

/** Thiruvathira — dancers in a ring, drawn as a simple radial circle of figures. */
export function ThiruvathiraMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="50" cy="50" r="30" strokeDasharray="2 6" opacity="0.5" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 50 50)`}>
          <circle cx="50" cy="17" r="4" fill="currentColor" />
          <path d="M50 21v10M44 26h12" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/** Sadya — a banana leaf laid out with small rice/curry dots. */
export function SadyaMotif({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <ellipse cx="50" cy="55" rx="38" ry="22" opacity="0.85" />
      <path d="M20 48c14-6 46-6 60 0" opacity="0.6" />
      <circle cx="40" cy="52" r="6" fill="currentColor" opacity="0.8" />
      <circle cx="58" cy="48" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="66" cy="58" r="3.5" fill="currentColor" opacity="0.6" />
      <circle cx="34" cy="62" r="3" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export const MOTIF_ICONS = {
  chenda: ChendaMotif,
  lamp: LampMotif,
  pookalam: PookalamMotif,
  leaf: LeafMotif,
  pulikali: PulikaliMotif,
  boat: BoatMotif,
  thiruvathira: ThiruvathiraMotif,
  sadya: SadyaMotif,
} as const;

export type MotifType = keyof typeof MOTIF_ICONS;
