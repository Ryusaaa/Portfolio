"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type LoaderMode = "intro" | "route";

interface RouteLoaderProps {
  covered: boolean;
  mode: LoaderMode;
  label: string;
  run: number;
  duration: number;
}

const SLATS = 16;
const SLAT_MS = 0.28;
const STAGGER = 0.014;
const EASE = [0.76, 0, 0.24, 1] as const;
const SCAN_MASK = "repeating-linear-gradient(to bottom, #000 0, #000 5px, transparent 5px, transparent 8px)";
const BAR_CELLS = 24;

function useProgress(run: number, duration: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round((1 - Math.pow(1 - t, 2.2)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setValue(0);
    };
  }, [run, duration]);

  return value;
}

export function RouteLoader({ covered, mode, label, run, duration }: RouteLoaderProps) {
  const progress = useProgress(run, duration);
  const filled = Math.round((progress / 100) * BAR_CELLS);
  const lines = mode === "intro" ? ["Satria Ibnu", "Safarudin"] : [label];

  return (
    <div
      data-transition-overlay
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ pointerEvents: covered ? "auto" : "none" }}
    >
      <div className="absolute inset-0 flex flex-col">
        {Array.from({ length: SLATS }, (_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ scaleY: covered ? 1 : 0 }}
            transition={{ duration: SLAT_MS, delay: i * STAGGER, ease: EASE }}
            className="block flex-1 bg-midnight-950"
            style={{
              transformOrigin: covered ? "top" : "bottom",
              boxShadow: "0 1px 0 var(--midnight-950)",
              borderBottom: "1px solid rgba(183, 209, 46, 0.12)",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: covered ? 1 : 0 }}
        transition={{ duration: covered ? 0.2 : 0.12, delay: covered ? 0.18 : 0 }}
        className="relative flex flex-1 flex-col justify-between px-6 py-6 md:px-12 md:py-10"
      >
        <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-midnight-300">
          <span>Satria Ibnu Safarudin — Portfolio</span>
          <span className="hidden sm:inline">Bandung, ID</span>
        </div>

        <div className="relative mx-auto w-full max-w-5xl text-center">
          <div
            className="font-display text-[clamp(2.75rem,11vw,9rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em]"
            style={{ WebkitMaskImage: SCAN_MASK, maskImage: SCAN_MASK }}
          >
            {lines.map((line) => (
              <span key={line} className="relative block">
                <span className="block text-midnight-700">{line}</span>
                <span
                  className="absolute inset-0 block text-midnight-500"
                  style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-midnight-300">
          <span className="font-pixel text-[8px] text-midnight-500">
            {mode === "intro" ? "Loading archive" : "Opening page"}
            <span className="loader-blink ml-1">_</span>
          </span>
          <span className="flex items-center gap-3 tabular-nums">
            <span className="hidden text-midnight-500 sm:inline">
              {"█".repeat(filled)}
              <span className="text-midnight-700">{"░".repeat(BAR_CELLS - filled)}</span>
            </span>
            <span className="w-10 text-right text-archive-paper">{String(progress).padStart(3, "0")}%</span>
          </span>
        </div>
      </motion.div>

      <span
        className="loader-sweep pointer-events-none absolute inset-x-0 top-0 h-px bg-midnight-500/40"
        style={{ opacity: covered ? 1 : 0 }}
      />
    </div>
  );
}
