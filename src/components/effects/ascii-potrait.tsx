"use client";

import { useEffect, useRef, useState } from "react";

const SOURCE = "/ascii-satria-source.jpg";
const FALLBACK = "/ascii-satria.png";

const SETTINGS = {
  version: 1,
  aspectRatio: "original",
  style: "ascii",
  cellSize: 6,
  charset: " .:-=+*#%@",
  colorMode: "source",
  ink: "#e6e3da",
  print: {
    density: 1,
    weight: 1,
    angle: -35,
    roughness: 0.35,
    invert: false,
    secondaryInk: "#ec6752",
    registration: 0.2,
    seed: 7,
  },
  warps: [],
  warpEdge: "clamp",
  crop: { x: 0.5, y: 0.5, zoom: 1, rotation: 0 },
  backdrop: { mode: "solid", color: "#0c0d0b", color2: "#1d1d1b", blur: 0, opacity: 0.2 },
  color: {
    brightness: 0.05,
    contrast: 1.2,
    saturation: 1.2,
    grayscale: 0,
    tint: "#e6e3da",
    amount: 0,
    blend: "source-over",
    blackPoint: 0,
    whitePoint: 1,
    gamma: 1,
    shadows: 0,
    highlights: 0,
    denoise: 0,
    levels: "auto",
  },
  dither: {
    algorithm: "atkinson",
    palette: "original",
    colors: ["#080808", "#e6e3da"],
    amount: 1,
    scale: 2,
    threshold: 0.5,
    motion: "none",
    speed: 1,
    direction: 45,
    colorSpace: "rgb",
  },
  mask: { enabled: false, invert: false, shapes: [] },
  lights: [],
  effects: { characterBloom: 0, blurType: "gaussian", focus: 0 },
  motion: { type: "glow", speed: 0.4, amount: 0.35 },
  hover: { effect: "water", strength: 0.45, radius: 0.35, edgeSafe: false },
} as const;

export function AsciiPortrait({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 h-full w-full";
    host.appendChild(canvas);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const abort = new AbortController();
    let studio: { destroy: () => void; pause: (value?: boolean) => void } | null = null;
    let cancelled = false;
    let visible = true;

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
            studio?.pause(reduced || !visible);
          })
        : null;
    observer?.observe(host);

    import("asciify-engine/studio")
      .then(({ mountStudio }) =>
        cancelled
          ? null
          : mountStudio(canvas, SOURCE, {
              settings: SETTINGS as never,
              maxDimension: 480,
              signal: abort.signal,
            })
      )
      .then((instance) => {
        if (!instance) return;
        if (cancelled) {
          instance.destroy();
          return;
        }
        studio = instance;
        if (reduced || !visible) instance.pause(true);
        setReady(true);
      })
      .catch(() => setReady(false));

    return () => {
      cancelled = true;
      abort.abort();
      observer?.disconnect();
      studio?.destroy();
      canvas.remove();
      setReady(false);
    };
  }, []);

  return (
    <div className={`relative aspect-[9/16] w-full overflow-hidden bg-midnight-950 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FALLBACK}
        alt="ASCII art portrait of Satria Ibnu Safarudin"
        width={640}
        height={1138}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        ref={hostRef}
        className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}