"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const LETTERS = "LOADING".split("");

const letterVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const [counter, setCounter] = useState(0);
  const [exiting, setExiting] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const botPanelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  /* ── Progress bar + counter ── */
  useEffect(() => {
    if (!isLoading || exiting) return;

    const progress = { val: 0 };

    tweenRef.current = gsap.to(progress, {
      val: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate() {
        const v = Math.round(progress.val);
        setCounter(v);
        if (barRef.current) {
          barRef.current.style.width = `${progress.val}%`;
        }
      },
      onComplete() {
        // Brief pause at 100, then split-wipe exit
        setTimeout(() => {
          setExiting(true);
        }, 300);
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [isLoading, exiting]);

  /* ── Split-wipe exit ── */
  useEffect(() => {
    if (!exiting) return;

    const top = topPanelRef.current;
    const bot = botPanelRef.current;
    if (!top || !bot) return;

    const tl = gsap.timeline({
      onComplete() {
        onComplete?.();
      },
    });

    tl.to(
      [top, bot],
      {
        yPercent: (i) => (i === 0 ? -100 : 100),
        duration: 0.75,
        ease: "power3.inOut",
        stagger: 0,
      }
    );
  }, [exiting, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.6 } }}
          className="fixed inset-0 z-[999] pointer-events-none"
          aria-hidden="true"
        >
          {/* Top panel */}
          <div
            ref={topPanelRef}
            className="loading-panel absolute inset-x-0 top-0 h-1/2 bg-[#15151e] flex flex-col items-center justify-end pb-8 overflow-hidden"
          >
            {/* Telemetry grid lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-white"
                  style={{ left: `${(i + 1) * 12.5}%` }}
                />
              ))}
            </div>

            {/* LOADING text — staggered letter reveal */}
            <div className="flex gap-[2px] mb-6" aria-label="Loading">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="loading-letter font-display text-5xl md:text-7xl font-bold tracking-[0.15em] text-white uppercase"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Red rule between top/bottom panels */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#e10600]" />
          </div>

          {/* Bottom panel */}
          <div
            ref={botPanelRef}
            className="loading-panel absolute inset-x-0 bottom-0 h-1/2 bg-[#15151e] flex flex-col items-center justify-start pt-8 overflow-hidden"
          >
            {/* Red rule at top of bottom panel */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#e10600]" />

            {/* Progress bar */}
            <div className="w-64 md:w-96 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[10px] text-[#a1a1aa] uppercase tracking-[0.2em]">
                  SYS INIT
                </span>
                <span className="font-mono text-[10px] text-[#e10600] tracking-widest tabular-nums">
                  {String(counter).padStart(3, "0")}
                </span>
              </div>

              {/* Track */}
              <div className="relative h-[2px] bg-[#38383f] w-full overflow-hidden">
                <div
                  ref={barRef}
                  className="absolute left-0 top-0 h-full bg-[#e10600]"
                  style={{ width: "0%", boxShadow: "0 0 8px #e10600" }}
                />
              </div>

              {/* Sector ticks */}
              <div className="flex justify-between mt-1">
                {["S1", "S2", "S3"].map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[9px] text-[#38383f] uppercase tracking-widest"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Telemetry grid lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-white"
                  style={{ left: `${(i + 1) * 12.5}%` }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
