"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { SectorTicks } from "./transition/split-panels";
import { EASE, GSAP_EASE_INOUT } from "@/lib/motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const TRACK =
  "M 180.0 440.0 L 720.0 440.0 Q 790 440 846.8 399.1 L 874.4 379.2 Q 915 350 915.0 300.0 L 915.0 290.0 Q 915 240 868.6 221.4 L 836.3 208.5 Q 790 190 765.0 233.2 L 757.5 246.1 Q 735 285 690.5 291.4 L 676.8 293.3 Q 630 300 602.7 261.4 L 597.3 253.6 Q 570 215 607.1 185.6 L 650.8 151.0 Q 690 120 644.6 99.0 L 600.9 78.9 Q 560 60 515.0 60.0 L 420.0 60.0 Q 370 60 333.6 94.3 L 317.8 109.2 Q 285 140 247.6 115.0 L 202.4 85.0 Q 165 60 127.6 85.0 L 101.6 102.3 Q 60 130 69.8 179.0 L 74.2 201.1 Q 85 255 137.7 270.8 L 187.1 285.6 Q 235 300 197.5 333.1 L 173.2 354.5 Q 150 375 159.1 404.5 L 167.1 430.4 Q 170 440 180.0 440.0 Z";

const LETTERS = "LOADING".split("");
const LIGHTS = [0, 1, 2, 3, 4];
const LINE_X = 200;
const LINE_OFFSET = 20;
const MIN_MS = 3600;
const MAX_MS = 7000;
const LIGHT_STEP_MS = 70;
const LIGHTS_OUT_MS = 480;

const SPEED_LINES = Array.from({ length: 14 }, (_, i) => ({
  top: (i * 37 + 11) % 97,
  width: 80 + ((i * 53) % 160),
  duration: 0.5 + ((i * 29) % 70) / 100,
  delay: ((i * 17) % 50) / 100,
}));

const letterVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.2 + i * 0.06, duration: 0.4, ease: EASE },
  }),
};

const gridStyle = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};

const checkerStyle = {
  backgroundImage: "conic-gradient(#f1f1f1 25%, #15151e 0 50%, #f1f1f1 0 75%, #15151e 0)",
  backgroundSize: "24px 24px",
};

function pose(path: SVGPathElement, length: number, distance: number) {
  const p = ((distance % length) + length) % length;
  const a = path.getPointAtLength(p);
  const b = path.getPointAtLength((p + 3) % length);
  return { x: a.x, y: a.y, angle: Math.atan2(b.y - a.y, b.x - a.x) };
}

function placeCar(car: SVGGElement, x: number, y: number, angle: number) {
  car.setAttribute(
    "transform",
    `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((angle * 180) / Math.PI).toFixed(1)}) scale(1.6)`
  );
}

function formatLap(ms: number) {
  const total = Math.max(0, Math.floor(ms));
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const t = total % 1000;
  return `${m}:${String(s).padStart(2, "0")}.${String(t).padStart(3, "0")}`;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const drsRef = useRef<HTMLSpanElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    const car = carRef.current;
    const trail = trailRef.current;
    const bar = barRef.current;
    if (!root || !path || !car || !trail || !bar) return;

    const length = path.getTotalLength();
    const total = length + LINE_OFFSET;
    trail.style.strokeDasharray = String(length);
    trail.style.strokeDashoffset = String(length);
    root.querySelectorAll<SVGGElement>("[data-sector]").forEach((g) => {
      const index = Number(g.dataset.sector);
      const p = pose(path, length, (length * index) / 3);
      const line = g.querySelector("line");
      const label = g.querySelector("text");
      line?.setAttribute(
        "transform",
        `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${((p.angle * 180) / Math.PI).toFixed(1)})`
      );
      let nx = -Math.sin(p.angle);
      let ny = Math.cos(p.angle);
      if ((p.x - 500) * nx + (p.y - 250) * ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      if (p.y + ny * 30 < 62) {
        nx = -nx;
        ny = -ny;
      }
      label?.setAttribute("x", (p.x + nx * 30).toFixed(1));
      label?.setAttribute("y", (p.y + ny * 30 + 4).toFixed(1));
    });

    const lights = Array.from(root.querySelectorAll<HTMLElement>("[data-light]"));
    const ticks = Array.from(root.querySelectorAll<HTMLElement>("[data-tick]"));
    const lineEls = Array.from(root.querySelectorAll<HTMLElement>("[data-speed-line]"));
    const linesWrap = linesRef.current;

    const proxy = { v: 0 };
    const state = { fonts: false, loaded: false, launched: false, done: false };
    const timers: ReturnType<typeof setTimeout>[] = [];
    let poll: ReturnType<typeof setInterval> | null = null;
    let exitTl: gsap.core.Timeline | null = null;
    let startedAt = 0;
    let lapMs = 0;
    let speed = 0;

    const render = () => {
      const v = proxy.v;
      const d = (v / 100) * total;
      const here = pose(path, length, d);
      const ahead = pose(path, length, d + 18);
      placeCar(car, here.x, here.y, here.angle);
      trail.style.strokeDashoffset = String(length - Math.min(d, length));

      let turn = Math.abs(ahead.angle - here.angle);
      if (turn > Math.PI) turn = Math.PI * 2 - turn;
      const straight = 1 - Math.min(1, turn / 0.85);
      const cap = 70 + v * 34;
      const goal = Math.min(cap, 95 + 245 * Math.pow(straight, 1.4));
      speed += (goal - speed) * 0.18;

      bar.style.transform = `scaleX(${v / 100})`;
      if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      if (speedRef.current) speedRef.current.textContent = String(Math.round(speed)).padStart(3, "0");
      if (drsRef.current) drsRef.current.dataset.on = String(straight > 0.97 && v > 8 && speed > 280);
      if (timerRef.current && state.launched) {
        const ms = state.done && lapMs > 0 ? lapMs : performance.now() - startedAt;
        timerRef.current.textContent = formatLap(ms);
      }
      if (statusRef.current) statusRef.current.textContent = v >= 99.5 ? "CHEQUERED FLAG" : "SYS INIT";
      ticks.forEach((el, i) => {
        el.dataset.on = String(v >= [33, 66, 100][i] - 0.5);
      });
    };

    const target = () => {
      const elapsed = performance.now() - startedAt;
      const real = 15 + (state.fonts ? 42 : 0) + (state.loaded ? 43 : 0);
      return Math.min(real, 100 * Math.min(1, elapsed / MIN_MS));
    };

    const advance = () => {
      if (!state.launched || state.done) return;
      gsap.to(proxy, { v: target(), duration: 0.3, ease: "none", overwrite: true });
    };

    const finish = () => {
      if (state.done) return;
      state.done = true;
      gsap.to(proxy, {
        v: 100,
        duration: 0.3,
        ease: "power1.out",
        overwrite: true,
        onComplete: () => {
          lapMs = performance.now() - startedAt;
        },
      });
      if (linesWrap) gsap.to(linesWrap, { opacity: 0, duration: 0.5 });
      delete document.documentElement.dataset.boot;
      exitTl = gsap.timeline({ delay: 0.95, onComplete });
      exitTl.to(root, { yPercent: -100, duration: 0.85, ease: GSAP_EASE_INOUT });
    };

    const maybeFinish = () => {
      if (!state.launched || !state.fonts || !state.loaded || state.done) return;
      timers.push(setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - startedAt))));
    };

    const launch = () => {
      state.launched = true;
      startedAt = performance.now();
      lights.forEach((l) => {
        l.dataset.on = "false";
      });
      if (linesWrap) gsap.to(linesWrap, { opacity: 1, duration: 0.4 });
      lineEls.forEach((el, i) => {
        const cfg = SPEED_LINES[i];
        gsap.fromTo(
          el,
          { x: -400 },
          { x: window.innerWidth + 400, duration: cfg.duration, delay: cfg.delay, repeat: -1, ease: "none" }
        );
      });
      advance();
      poll = setInterval(advance, 150);
      timers.push(
        setTimeout(() => {
          if (poll) clearInterval(poll);
        }, MIN_MS + 300)
      );
      maybeFinish();
    };

    gsap.ticker.add(render);
    render();

    lights.forEach((l, i) => {
      timers.push(
        setTimeout(() => {
          l.dataset.on = "true";
        }, i * LIGHT_STEP_MS)
      );
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
      gsap.ticker.remove(render);
      exitTl?.kill();
      gsap.killTweensOf(proxy);
      gsap.killTweensOf(lineEls);
      gsap.killTweensOf(root);
      if (linesWrap) gsap.killTweensOf(linesWrap);
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
      className="fixed inset-0 z-[999]"
    >
      <span role="status" className="sr-only">
        Loading
      </span>

      <div className="absolute inset-0 overflow-hidden bg-[#15151e] text-white flex flex-col">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={gridStyle} />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }}
        />
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[1px] bg-[#e10600]" />

        <div ref={linesRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ opacity: 0 }}>
          {SPEED_LINES.map((line, i) => (
            <div
              key={i}
              data-speed-line
              className="absolute left-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ top: `${line.top}%`, width: `${line.width}px`, transform: "translateX(-400px)" }}
            />
          ))}
        </div>

        <header className="relative z-10 shrink-0 px-6 md:px-12 pt-6 md:pt-8 flex flex-col gap-4">
          <div className="flex items-start justify-between font-mono text-[10px] md:text-xs uppercase tracking-[0.25em]">
            <div>
              <p className="text-[#e10600]">Ryu Grand Prix</p>
              <p className="text-[#a1a1aa] mt-1">Portfolio Circuit</p>
            </div>
            <div className="text-right">
              <p className="text-white">Lap 1/1</p>
              <p className="text-[#a1a1aa] mt-1">Q1 Session</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-3" aria-hidden="true">
            {LIGHTS.map((i) => (
              <span
                key={i}
                data-light
                data-on="false"
                className="block h-3 w-3 md:h-4 md:w-4 rounded-full bg-[#38383f] transition-[background-color,box-shadow] duration-100 data-[on=true]:bg-[#e10600] data-[on=true]:shadow-[0_0_14px_#e10600]"
              />
            ))}
          </div>
        </header>

        <div className="relative z-10 flex-1 min-h-0 px-2 md:px-12 py-2" aria-hidden="true">
          <svg viewBox="40 25 910 470" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="lsc-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="lsc-check" width="6" height="6" patternUnits="userSpaceOnUse">
                <rect width="6" height="6" fill="#15151e" />
                <rect width="3" height="3" fill="#f1f1f1" />
                <rect x="3" y="3" width="3" height="3" fill="#f1f1f1" />
              </pattern>
            </defs>

            <path d={TRACK} fill="none" stroke="#38383f" strokeWidth="28" strokeLinejoin="round" />
            <path d={TRACK} fill="none" stroke="#e10600" strokeWidth="26" strokeDasharray="6 6" opacity="0.75" />
            <path
              d={TRACK}
              fill="none"
              stroke="#f1f1f1"
              strokeWidth="26"
              strokeDasharray="6 6"
              strokeDashoffset="6"
              opacity="0.75"
            />
            <path ref={pathRef} d={TRACK} fill="none" stroke="#101015" strokeWidth="20" strokeLinejoin="round" />
            <path d={TRACK} fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="8 10" />

            {[1, 2].map((s) => (
              <g key={s} data-sector={s}>
                <line x1="0" y1="-15" x2="0" y2="15" stroke="#f1f1f1" strokeWidth="2" opacity="0.8" />
                <text
                  textAnchor="middle"
                  fill="#a1a1aa"
                  fontSize="13"
                  letterSpacing="2"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                >
                  {`S${s}`}
                </text>
              </g>
            ))}

            <rect x={LINE_X - 3} y="427" width="6" height="26" fill="url(#lsc-check)" />
            <text
              x={LINE_X}
              y="478"
              textAnchor="middle"
              fill="#a1a1aa"
              fontSize="13"
              letterSpacing="2"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              START / FINISH
            </text>

            <path
              ref={trailRef}
              d={TRACK}
              fill="none"
              stroke="#e10600"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#lsc-glow)"
            />

            <g ref={carRef} transform="translate(180 440) scale(1.6)" style={{ filter: "drop-shadow(0 0 5px rgba(225,6,0,0.9))" }}>
                            <rect x="4" y="-8" width="6" height="3.2" rx="0.6" fill="#0b0b0f" />
              <rect x="4" y="4.8" width="6" height="3.2" rx="0.6" fill="#0b0b0f" />
              <rect x="-13" y="-8.6" width="7.5" height="3.6" rx="0.6" fill="#0b0b0f" />
              <rect x="-13" y="5" width="7.5" height="3.6" rx="0.6" fill="#0b0b0f" />
              <rect x="-16" y="-7" width="3.2" height="14" fill="#f1f1f1" />
              <polygon points="17,0 8,-1.8 -2,-2.6 -11,-3 -14,-2.2 -14,2.2 -11,3 -2,2.6 8,1.8" fill="#e10600" />
              <rect x="12" y="-7" width="2.8" height="14" fill="#f1f1f1" />
              <circle cx="-1" cy="0" r="1.8" fill="#15151e" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 shrink-0 h-[200px] md:h-[180px]">
          <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center px-6">
            <div className="flex gap-[2px] mb-4">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="loading-letter font-display text-3xl md:text-5xl font-bold tracking-[0.15em] text-white uppercase"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <div className="w-72 md:w-[28rem] mb-4 grid grid-cols-3 font-mono text-[10px] uppercase tracking-[0.2em]">
              <div className="text-left">
                <p className="text-[#a1a1aa]">Speed</p>
                <p className="text-white tabular-nums">
                  <span ref={speedRef}>000</span> km/h
                </p>
              </div>
              <div className="text-center">
                <p className="text-[#a1a1aa]">DRS</p>
                <span
                  ref={drsRef}
                  data-on="false"
                  className="inline-block px-2 border border-[#38383f] text-[#38383f] transition-colors duration-150 data-[on=true]:border-[#e10600] data-[on=true]:bg-[#e10600] data-[on=true]:text-white"
                >
                  Open
                </span>
              </div>
              <div className="text-right">
                <p className="text-[#a1a1aa]">Lap time</p>
                <p className="text-white tabular-nums">
                  <span ref={timerRef}>0:00.000</span>
                </p>
              </div>
            </div>

            <div className="w-72 md:w-[28rem]">
              <div className="flex justify-between items-center mb-2">
                <span ref={statusRef} className="font-mono text-[10px] text-[#a1a1aa] uppercase tracking-[0.2em]">
                  SYS INIT
                </span>
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
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute left-0 right-0 top-full h-6" style={checkerStyle} />
    </div>
  );
}