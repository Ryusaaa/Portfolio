"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { EASE, GSAP_EASE_INOUT } from "@/lib/motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LIGHTS = [0, 1, 2, 3, 4];
const MIN_MS = 3200;
const MAX_MS = 7000;
const LIGHT_STEP_MS = 70;
const LIGHTS_OUT_MS = 480;

/** Red Bull car — PNG image with flipped orientation (nose points right) and motion blur effect */
function F1Car() {
  return (
    <div
      className="relative w-[260px] h-[92px] sm:w-[320px] sm:h-[113px] md:w-[360px] md:h-[128px]"
      style={{
        filter: "drop-shadow(0 0 14px rgba(227,33,25,0.7))",
      }}
    >
      {/* Motion blur ghost behind the car (trailing to the left) */}
      <img
        src="/Image/redbull-car.png"
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none -scale-x-100 -translate-x-6 sm:-translate-x-8"
        style={{
          filter: "blur(10px) saturate(1.6)",
          opacity: 0.45,
          transformOrigin: "center",
        }}
      />
      {/* Main car image (flipped with -scale-x-100 so nose faces right) */}
      <img
        src="/Image/redbull-car.png"
        alt="Red Bull F1 Car"
        className="relative w-full h-full object-contain pointer-events-none select-none -scale-x-100"
      />
    </div>
  );
}

const letterVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.1 + i * 0.06, duration: 0.4, ease: EASE },
  }),
};

const LETTERS = "LOADING".split("");

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const car = carRef.current;
    const bar = barRef.current;
    if (!root || !car || !bar) return;

    // ── Progress tracking ─────────────────────────────────────
    const proxy = { v: 0 };
    const state = { fonts: false, loaded: false, launched: false, done: false };
    const timers: ReturnType<typeof setTimeout>[] = [];
    let poll: ReturnType<typeof setInterval> | null = null;
    let exitTl: gsap.core.Timeline | null = null;
    let carTween: gsap.core.Tween | null = null;
    let startedAt = 0;

    const updateHUD = () => {
      const v = proxy.v;
      bar.style.transform = `scaleX(${v / 100})`;
      if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      if (statusRef.current) statusRef.current.textContent = v >= 99.5 ? "LIGHTS OUT" : "SYS INIT";
    };

    const target = () => {
      const elapsed = performance.now() - startedAt;
      const real = 15 + (state.fonts ? 42 : 0) + (state.loaded ? 43 : 0);
      return Math.min(real, 100 * Math.min(1, elapsed / MIN_MS));
    };

    const advance = () => {
      if (!state.launched || state.done) return;
      gsap.to(proxy, { v: target(), duration: 0.3, ease: "none", overwrite: true, onUpdate: updateHUD });
    };

    const finish = () => {
      if (state.done) return;
      state.done = true;
      // Kill looping car and do one final fast pass before exit
      carTween?.kill();
      gsap.to(proxy, { v: 100, duration: 0.3, ease: "power1.out", overwrite: true, onUpdate: updateHUD });
      // Final blasting pass
      gsap.fromTo(
        car,
        { x: "-120vw" },
        {
          x: "120vw",
          duration: 0.55,
          ease: "power2.in",
          onComplete: () => {
            delete document.documentElement.dataset.boot;
            exitTl = gsap.timeline({ delay: 0.15, onComplete });
            exitTl.to(root, { yPercent: -100, duration: 0.8, ease: GSAP_EASE_INOUT });
          },
        }
      );
    };

    const maybeFinish = () => {
      if (!state.launched || !state.fonts || !state.loaded || state.done) return;
      timers.push(setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - startedAt))));
    };

    // ── Car looping animation ─────────────────────────────────
    // Car flies from left off-screen to right off-screen, repeating.
    // Duration ~0.7 s per pass → feels like a real F1 flyby.
    const startCarLoop = () => {
      gsap.set(car, { x: "-120vw" });
      carTween = gsap.to(car, {
        x: "120vw",
        duration: 0.72,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 1.1,
        onRepeat: () => {
          gsap.set(car, { x: "-120vw" });
        },
      });
    };

    const lights = Array.from(root.querySelectorAll<HTMLElement>("[data-light]"));

    const launch = () => {
      state.launched = true;
      startedAt = performance.now();
      lights.forEach((l) => { l.dataset.on = "false"; });
      startCarLoop();
      advance();
      poll = setInterval(advance, 150);
      timers.push(setTimeout(() => { if (poll) clearInterval(poll); }, MIN_MS + 300));
      maybeFinish();
    };

    updateHUD();

    lights.forEach((l, i) => {
      timers.push(setTimeout(() => { l.dataset.on = "true"; }, i * LIGHT_STEP_MS));
    });
    timers.push(setTimeout(launch, LIGHTS_OUT_MS));

    void (document.fonts?.ready ?? Promise.resolve()).then(() => {
      state.fonts = true;
      advance();
      maybeFinish();
    });
    new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    }).then(() => {
      state.loaded = true;
      advance();
      maybeFinish();
    });

    timers.push(setTimeout(finish, MAX_MS));

    return () => {
      timers.forEach(clearTimeout);
      if (poll) clearInterval(poll);
      carTween?.kill();
      exitTl?.kill();
      gsap.killTweensOf(proxy);
      gsap.killTweensOf(root);
      delete document.documentElement.dataset.boot;
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      data-boot-overlay
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
      className="fixed inset-0 z-[999] bg-[#0C162F] text-white flex flex-col overflow-hidden"
    >
      <span role="status" className="sr-only">Loading</span>

      {/* Top red accent */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-[#E32119]" />

      {/* Header */}
      <header className="relative z-10 shrink-0 px-6 md:px-12 pt-8 md:pt-10 flex flex-col items-center gap-5">
        <div className="flex items-start justify-between w-full font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#8fa0c0]">
          <span className="text-[#E32119]">Ryu Grand Prix</span>
          <span>Lap 1 / 1</span>
        </div>

        {/* Start lights */}
        <div className="flex items-center gap-3 md:gap-4" aria-hidden="true">
          {LIGHTS.map((i) => (
            <span
              key={i}
              data-light
              data-on="false"
              className="block h-4 w-4 md:h-5 md:w-5 rounded-full bg-[#1e2f55] transition-[background-color,box-shadow] duration-100 data-[on=true]:bg-[#E32119] data-[on=true]:shadow-[0_0_16px_#E32119]"
            />
          ))}
        </div>
      </header>

      {/* Runway — car flies through here */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {/* Asphalt ground line */}
        <div aria-hidden="true" className="absolute left-0 right-0 h-[1px] bg-white/[0.07]" style={{ top: "calc(50% + 36px)" }} />
        {/* Faint centre divider */}
        <div aria-hidden="true" className="absolute left-0 right-0 h-[1px] bg-[#E32119]/20" style={{ top: "50%" }} />

        {/* Car wrapper — starts off-screen left, GSAP moves it */}
        <div
          ref={carRef}
          aria-hidden="true"
          className="absolute"
          style={{ top: "50%", transform: "translateY(-60%)", willChange: "transform" }}
        >
          <F1Car />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 shrink-0 flex flex-col items-center gap-5 px-6 md:px-12 pb-10 md:pb-14">
        {/* LOADING letters */}
        <div className="flex gap-[3px]" aria-hidden="true">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="font-display text-2xl md:text-4xl font-bold tracking-[0.18em] text-white uppercase"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Progress */}
        <div className="w-64 md:w-96">
          <div className="flex justify-between items-center mb-2">
            <span ref={statusRef} className="font-mono text-[10px] text-[#8fa0c0] uppercase tracking-[0.2em]">
              SYS INIT
            </span>
            <span ref={counterRef} className="font-mono text-[10px] text-[#FFCC00] tracking-widest tabular-nums">
              000
            </span>
          </div>
          <div className="relative h-[2px] bg-[#1e2f55] w-full overflow-hidden">
            <div
              ref={barRef}
              className="absolute inset-0 bg-[#E32119] origin-left"
              style={{ transform: "scaleX(0)", boxShadow: "0 0 8px #E32119" }}
            />
          </div>
        </div>
      </footer>

      {/* Checker stripe */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-full h-5"
        style={{
          backgroundImage: "conic-gradient(#f1f1f1 25%, #0C162F 0 50%, #f1f1f1 0 75%, #0C162F 0)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}
