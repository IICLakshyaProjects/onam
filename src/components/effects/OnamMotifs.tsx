/**
 * Small line-art silhouettes of traditional Onam motifs — a chenda (festival
 * drum), a nilavilakku (standing oil lamp), a pookalam (flower rangoli) and
 * a banana leaf. Original vector icons (not photos), sized to sit quietly in
 * a scene's background and animate with the `.floaty*` CSS keyframes.
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
