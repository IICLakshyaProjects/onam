"use client";

import { useEffect, useRef } from "react";
import { useFirstInteraction } from "@/lib/useFirstInteraction";

type ChendaBeatProps = {
  /** Change this value to trigger a fresh beat (e.g. the countdown's step index). */
  beatTrigger?: number | string;
  paused?: boolean;
  /** Optional real chenda recording — used instead of the synthesized hit when it loads successfully. */
  sampleSrc?: string;
  volume?: number;
};

/**
 * A sharp, low percussive "hit" cued to `beatTrigger` changes — stands in
 * for a chenda (Kerala festival drum) beat during the countdown. Fully
 * synthesized with the Web Audio API (a pitched thump + filtered noise
 * crack), so it works with zero audio assets; pass `sampleSrc` to swap in a
 * real recording later without touching the calling scene.
 *
 * Renders nothing. Browsers suspend/block audio until a real user gesture —
 * this resumes the shared AudioContext on the first keypress/tap via
 * `useFirstInteraction`, same mechanism the video uses to recover sound.
 */
export default function ChendaBeat({ beatTrigger, paused = false, sampleSrc, volume = 0.8 }: ChendaBeatProps) {
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sampleBufferRef = useRef<AudioBuffer | null>(null);
  const sampleFailedRef = useRef(false);

  function getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!audioCtxRef.current) audioCtxRef.current = new Ctor();
    return audioCtxRef.current;
  }

  // Best-effort load of a real sample, if one was configured.
  useEffect(() => {
    if (!sampleSrc) return;
    const ctx = getContext();
    if (!ctx) return;
    let cancelled = false;

    fetch(sampleSrc)
      .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error("not found"))))
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        if (!cancelled) sampleBufferRef.current = decoded;
      })
      .catch(() => {
        sampleFailedRef.current = true;
      });

    return () => {
      cancelled = true;
    };
  }, [sampleSrc]);

  useFirstInteraction(() => {
    audioCtxRef.current?.resume().catch(() => {});
  });

  useEffect(() => {
    if (beatTrigger === undefined) return;
    if (pausedRef.current) return;
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    if (sampleBufferRef.current) {
      playSample(ctx, sampleBufferRef.current, volume);
    } else {
      playSynthesizedHit(ctx, volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatTrigger]);

  return null;
}

function playSample(ctx: AudioContext, buffer: AudioBuffer, volume: number) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  source.connect(gain).connect(ctx.destination);
  source.start();
}

/** Synthesizes a single sharp drum hit: a pitched low thump + a short filtered noise crack. */
function playSynthesizedHit(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;

  // Low thump — a quick downward pitch sweep, like a struck drum skin.
  const thump = ctx.createOscillator();
  thump.type = "sine";
  thump.frequency.setValueAtTime(180, now);
  thump.frequency.exponentialRampToValueAtTime(55, now + 0.12);

  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(volume, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  thump.connect(thumpGain).connect(ctx.destination);
  thump.start(now);
  thump.stop(now + 0.24);

  // Noise crack — the sharp transient attack of a stick/hand strike.
  const bufferSize = Math.floor(ctx.sampleRate * 0.06);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 1800;
  bandpass.Q.value = 0.9;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.7, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  noise.connect(bandpass).connect(noiseGain).connect(ctx.destination);
  noise.start(now);
}
