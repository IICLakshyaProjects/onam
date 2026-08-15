"use client";

import Image from "next/image";
import { useFirstAvailableSrc } from "@/lib/useImageAvailability";
import { MOTIF_ICONS, type MotifType } from "@/components/effects/OnamMotifs";

type Slot = { position: string; float: "floaty" | "floaty-alt"; responsive?: string };

/** Fixed edge positions so motifs never collide with a scene's centered text. */
const SLOTS: Slot[] = [
  { position: "left-[6%] top-[16%]", float: "floaty" },
  { position: "right-[8%] top-[20%]", float: "floaty-alt" },
  { position: "left-[10%] bottom-[14%]", float: "floaty" },
  { position: "right-[10%] bottom-[18%]", float: "floaty-alt" },
  { position: "right-[22%] top-[8%]", float: "floaty-alt", responsive: "hidden md:block" },
  { position: "left-[24%] bottom-[8%]", float: "floaty", responsive: "hidden md:block" },
  { position: "left-[2%] top-[45%]", float: "floaty", responsive: "hidden lg:block" },
  { position: "right-[3%] top-[48%]", float: "floaty-alt", responsive: "hidden lg:block" },
];

const SIZE_CLASSES = {
  default: "h-20 w-20 sm:h-28 sm:w-28",
  large: "h-28 w-28 sm:h-36 sm:w-36 lg:h-40 lg:w-40",
} as const;

const TINT_SETS = {
  default: ["text-onam-gold/25", "text-onam-amber/25", "text-onam-crimson/25", "text-onam-green/30", "text-onam-cream/15"],
  vivid: ["text-onam-gold/40", "text-onam-amber/38", "text-onam-crimson/35", "text-onam-green/42", "text-onam-cream/28"],
} as const;

type OnamMotifFieldProps = {
  /** Which motifs to scatter (cycled if there are more slots than types). */
  types: MotifType[];
  /** How many slots to fill — defaults to `types.length`, capped at 8. */
  count?: number;
  /** Larger motifs for hero scenes like the title hook. */
  size?: keyof typeof SIZE_CLASSES;
  /** Brighter tints so motifs read over a busy backdrop. */
  vivid?: boolean;
  /** Optional real photo candidates (e.g. [".webp", ".png"] for the same name), keyed by motif type. The first candidate that exists is used instead of the vector icon. */
  imageSrcs?: Partial<Record<MotifType, string[]>>;
};

/**
 * Scatters a handful of Onam motifs (chenda, pulikali, lamp, pookalam, leaf,
 * boat, thiruvathira, sadya) around a scene's edges, each gently floating.
 * Renders the original vector icon by default; if `imageSrcs` supplies a
 * real photo for a motif and it loads successfully, that photo is used
 * instead — so dropping real images into `/public/media/motifs/` upgrades
 * the whole app without touching any scene component.
 */
export default function OnamMotifField({ types, count, size = "default", vivid = false, imageSrcs }: OnamMotifFieldProps) {
  if (types.length === 0) return null;
  const n = Math.min(count ?? types.length, SLOTS.length);
  const tints = TINT_SETS[vivid ? "vivid" : "default"];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const type = types[i % types.length];
        const slot = SLOTS[i];
        const tint = tints[i % tints.length];
        return (
          <MotifSlotItem
            key={i}
            type={type}
            srcs={imageSrcs?.[type]}
            className={`${slot.float} absolute ${slot.position} ${slot.responsive ?? ""} ${sizeClass} ${tint}`}
          />
        );
      })}
    </>
  );
}

function MotifSlotItem({ type, srcs, className }: { type: MotifType; srcs?: string[]; className: string }) {
  // Each candidate is checked once per unique path for the whole page
  // session — a motif photo that isn't there yet never gets re-requested on
  // every scene switch or loop iteration (see useFirstAvailableSrc).
  const resolvedSrc = useFirstAvailableSrc(srcs);
  const Icon = MOTIF_ICONS[type];

  if (!resolvedSrc) {
    return <Icon aria-hidden className={className} />;
  }

  return (
    <div aria-hidden className={`${className} relative`}>
      <Image src={resolvedSrc} alt="" fill sizes="140px" style={{ objectFit: "contain" }} />
    </div>
  );
}
