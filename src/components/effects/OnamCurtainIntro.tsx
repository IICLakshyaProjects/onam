"use client";

import { useEffect, type CSSProperties } from "react";

type OnamCurtainIntroProps = {
  onComplete: () => void;
};

/** 0.0s – 0.5s: curtain holds closed. */
const CURTAIN_PAUSE_MS = 500;
/** 0.5s – 4.0s: curtain pulls open from center. */
const CURTAIN_OPEN_MS = 3500;

/**
 * Theatrical Kerala/Onam stage curtain — fabric gathers from the center
 * toward both sides with curved inner edges. No dark overlay; the
 * presentation underneath stays visible through the opening immediately.
 */
export default function OnamCurtainIntro({ onComplete }: OnamCurtainIntroProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReducedMotion ? 1 : CURTAIN_PAUSE_MS + CURTAIN_OPEN_MS + 80;

    const id = window.setTimeout(onComplete, delay);
    return () => window.clearTimeout(id);
  }, [onComplete]);

  return (
    <div
      className="onam-curtain-intro"
      aria-hidden
      style={
        {
          "--curtain-pause": `${CURTAIN_PAUSE_MS}ms`,
          "--curtain-open": `${CURTAIN_OPEN_MS}ms`,
        } as CSSProperties
      }
    >
      <Valance />
      <CurtainDrape side="left" />
      <CurtainDrape side="right" />
    </div>
  );
}

function Valance() {
  return (
    <div className="onam-curtain-valance">
      <svg className="onam-curtain-gold-trim" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="curtainGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3d78a" />
            <stop offset="45%" stopColor="#e8b545" />
            <stop offset="100%" stopColor="#b8862a" />
          </linearGradient>
        </defs>
        <path
          d="M0,18 Q300,6 600,18 T1200,18 L1200,0 L0,0 Z"
          fill="url(#curtainGold)"
          opacity="0.85"
        />
        <path
          d="M0,28 Q150,22 300,28 T600,28 T900,28 T1200,28"
          fill="none"
          stroke="#f6e8c9"
          strokeWidth="1.2"
          opacity="0.35"
        />
        {Array.from({ length: 18 }, (_, i) => {
          const x = 33 + i * 64;
          return (
            <g key={i} transform={`translate(${x} 44)`} opacity="0.55">
              <circle r="5" fill="none" stroke="#f6e8c9" strokeWidth="1" />
              <path d="M0,-9 L0,9 M-7,0 L7,0" stroke="#e8b545" strokeWidth="0.8" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CurtainDrape({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div className={`onam-curtain-drape ${isLeft ? "onam-curtain-drape-left" : "onam-curtain-drape-right"}`}>
      <div className="onam-curtain-drape-body">
        <div className={`onam-curtain-velvet ${isLeft ? "onam-curtain-velvet-left" : "onam-curtain-velvet-right"}`} />
        <div className="onam-curtain-velvet-folds" />
        <div className={`onam-curtain-velvet-sheen ${isLeft ? "onam-curtain-velvet-sheen-left" : "onam-curtain-velvet-sheen-right"}`} />
        <GoldMotifOverlay side={side} />
        <InnerEdgeGoldTrim side={side} />
      </div>
      <GatheredFoldStack side={side} />
    </div>
  );
}

function GoldMotifOverlay({ side }: { side: "left" | "right" }) {
  const mirror = side === "right" ? "scale-x-[-1]" : "";

  return (
    <svg
      className={`onam-curtain-motifs ${mirror}`}
      viewBox="0 0 200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id="curtainPookalam" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="4" fill="#e8b545" opacity="0.22" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="40"
              cy="18"
              rx="5"
              ry="9"
              fill="#e8b545"
              opacity="0.12"
              transform={`rotate(${deg} 40 40)`}
            />
          ))}
        </pattern>
      </defs>
      <rect width="200" height="800" fill="url(#curtainPookalam)" />
      {[120, 280, 440, 600].map((y) => (
        <g key={y} transform={`translate(36 ${y})`} opacity="0.28">
          <path
            d="M14 0c4 6 4 12 0 18-4-6-4-12 0-18Z"
            fill="none"
            stroke="#f6e8c9"
            strokeWidth="1.2"
          />
          <path d="M14 18v10M8 28h12" stroke="#e8b545" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

function InnerEdgeGoldTrim({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <svg
      className={`onam-curtain-inner-trim ${isLeft ? "onam-curtain-inner-trim-left" : "onam-curtain-inner-trim-right"}`}
      viewBox="0 0 40 800"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="curtainTrimGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3d78a" />
          <stop offset="50%" stopColor="#e8b545" />
          <stop offset="100%" stopColor="#b8862a" />
        </linearGradient>
      </defs>
      <path
        d="M8,0 Q22,40 10,80 T14,160 T8,240 T16,320 T10,400 T14,480 T8,560 T16,640 T10,720 T12,800"
        fill="none"
        stroke="url(#curtainTrimGold)"
        strokeWidth="2.5"
        opacity="0.75"
      />
      <path
        d="M18,0 Q28,60 16,120 T20,240 T16,360 T22,480 T18,600 T24,720 T20,800"
        fill="none"
        stroke="#f6e8c9"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}

function GatheredFoldStack({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div className={`onam-curtain-gather ${isLeft ? "onam-curtain-gather-left" : "onam-curtain-gather-right"}`}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="onam-curtain-gather-fold" style={{ ["--fold-i" as string]: i }} />
      ))}
    </div>
  );
}
