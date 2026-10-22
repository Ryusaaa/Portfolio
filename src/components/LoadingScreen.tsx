"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { SplitPanels, SectorTicks } from "./transition/split-panels";
import { EASE, GSAP_EASE_INOUT } from "@/lib/motion";
import { playSound } from "@/lib/sound";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LETTERS = "LOADING".split("");
const MIN_MS = 900;
const MAX_MS = 2000;

const letterVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: EASE },
  }),
};

/**
 * Boot screen. Progress is tied to real readiness: fonts + window load.
 * Visible for at least MIN_MS and never longer than MAX_MS.
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const startedAt = performance.now();
    const state = { fonts: false, loaded: false, shown: 0, done: false };
    const proxy = { v: 0 };
    let exitTl: gsap.core.Timeline | null = null;
    let forceTimer: ReturnType<typeof setTimeout> | null = null;
    let minTimer: ReturnType<typeof setTimeout> | null = null;

    const paint = () => {
      const v = proxy.v;
      if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      root.querySelectorAll<HTMLElement>("[data-tick]").forEach((el, i) => {
        el.dataset.on = String(v >= [33, 66, 100][i] - 0.5);
      });
    };

    const target = () => {
      const elapsed = performance.now() - startedAt;
      // Real stages: start 15, fonts +42, window load +43. Never ahead of the minimum visible time.
      const real = 15 + (state.fonts ? 42 : 0) + (state.loaded ? 43 : 0);
      return Math.min(real, 100 * Math.min(1, elapsed / MIN_MS));
    };

    const advance = () => {
      if (state.done) return;
      gsap.to(proxy, { v: target(), duration: 0.35, ease: "power2.out", overwrite: true, onUpdate: paint });
    };

    const finish = () => {
      if (state.done) return;
      state.done = true;
      gsap.to(proxy, { v: 100, duration: 0.25, ease: "power2.out", overwrite: true, onUpdate: paint });
      // Reveal the page just as the wipe starts.
      delete document.documentElement.dataset.boot;
      exitTl = gsap.timeline({ delay: 0.3, onComplete });
      exitTl.to([topRef.current, botRef.current], {
        yPercent: (i: number) => (i === 0 ? -100 : 100),
        duration: 0.75,
        ease: GSAP_EASE_INOUT,
      });
    };

    const maybeFinish = () => {
      if (state.fonts && state.loaded) {
        const wait = Math.max(0, MIN_MS - (performance.now() - startedAt));
        minTimer = setTimeout(finish, wait);
      }
    };

    const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => {
      state.fonts = true;
      advance();
    });
    const loadReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    }).then(() => {
      state.loaded = true;
      advance();
    });

    // Entrance sound. Browsers usually block audio before the first user gesture,
    // so if autoplay is refused, play it once on the first click/tap/key while the boot screen is still up.
    let cancelled = false;
    let removeGesture = () => {};
    playSound("passing").then((ok) => {
      if (ok || cancelled || state.done) return;
      const retry = () => {
        removeGesture();
        if (!state.done) void playSound("passing");
      };
      window.addEventListener("pointerdown", retry, { once: true });
      window.addEventListener("keydown", retry, { once: true });
      removeGesture = () => {
        window.removeEventListener("pointerdown", retry);
        window.removeEventListener("keydown", retry);
      };
    });

    Promise.all([fontsReady, loadReady]).then(maybeFinish);
    forceTimer = setTimeout(finish, MAX_MS);
    advance();
    // Keep the bar honest while waiting: re-evaluate until the minimum time has passed.
    const poll = setInterval(advance, 150);
    const stopPoll = setTimeout(() => clearInterval(poll), MIN_MS + 200);

    return () => {
      cancelled = true;
      removeGesture();
      clearInterval(poll);
      clearTimeout(stopPoll);
      if (forceTimer) clearTimeout(forceTimer);
      if (minTimer) clearTimeout(minTimer);
      exitTl?.kill();
      gsap.killTweensOf(proxy);
      delete document.documentElement.dataset.boot;
    };
  }, [onComplete]);

  return (
    <div ref={rootRef} data-boot-overlay className="fixed inset-0 z-[999] pointer-events-none" aria-hidden="true">
      <SplitPanels
        topRef={topRef}
        bottomRef={botRef}
        top={
          <div className="flex gap-[2px] mb-6">
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
        }
        bottom={
          <div className="w-64 md:w-96 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-[#a1a1aa] uppercase tracking-[0.2em]">SYS INIT</span>
              <span ref={counterRef} className="font-mono text-[10px] text-[#e10600] tracking-widest tabular-nums">
                000
              </span>
            </div>
            <div className="relative h-[2px] bg-[#38383f] w-full overflow-hidden">
              <div
                ref={barRef}
                className="absolute inset-0 bg-[#e10600] origin-left"
                style={{ transform: "scaleX(0)", boxShadow: "0 0 8px #e10600" }}
              />
            </div>
            <SectorTicks />
          </div>
        }
      />
    </div>
  );
}