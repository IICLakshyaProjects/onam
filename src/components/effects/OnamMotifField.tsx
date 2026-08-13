"use client";

import { useState } from "react";
import Image from "next/image";
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

const TINTS = ["text-onam-gold/25", "text-onam-amber/25", "text-onam-crimson/25", "text-onam-green/30", "text-onam-cream/15"];

type OnamMotifFieldProps = {
  /** Which motifs to scatter (cycled if there are more slots than types). */
  types: MotifType[];
  /** How many slots to fill — defaults to `types.length`, capped at 8. */
  count?: number;
  /** Optional real photos, keyed by motif type — used instead of the vector icon when they load. */
  imageSrcs?: Partial<Record<MotifType, string>>;
};

/**
 * Scatters a handful of Onam motifs (chenda, pulikali, lamp, pookalam, leaf,
 * boat, thiruvathira, sadya) around a scene's edges, each gently floating.
 * Renders the original vector icon by default; if `imageSrcs` supplies a
 * real photo for a motif and it loads successfully, that photo is used
 * instead — so dropping real images into `/public/media/motifs/` upgrades
 * the whole app without touching any scene component.
 */
export default function OnamMotifField({ types, count, imageSrcs }: OnamMotifFieldProps) {
  if (types.length === 0) return null;
  const n = Math.min(count ?? types.length, SLOTS.length);

  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const type = types[i % types.length];
        const slot = SLOTS[i];
        const tint = TINTS[i % TINTS.length];
        return (
          <MotifSlotItem
            key={i}
            type={type}
            src={imageSrcs?.[type]}
            className={`${slot.float} absolute ${slot.position} ${slot.responsive ?? ""} h-20 w-20 sm:h-28 sm:w-28 ${tint}`}
          />
        );
      })}
    </>
  );
}

function MotifSlotItem({ type, src, className }: { type: MotifType; src?: string; className: string }) {
  const [failed, setFailed] = useState(false);
  const Icon = MOTIF_ICONS[type];

  if (!src || failed) {
    return <Icon aria-hidden className={className} />;
  }

  return (
    <div aria-hidden className={`${className} relative`}>
      <Image src={src} alt="" fill sizes="140px" style={{ objectFit: "contain" }} onError={() => setFailed(true)} />
    </div>
  );
}
