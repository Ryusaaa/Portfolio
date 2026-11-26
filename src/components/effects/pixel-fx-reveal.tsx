"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { createFrame, clearFrame, createFx, composite } from "@/lib/pixelfx/core/index.js";
import * as pixelDissolve from "@/lib/pixelfx/fx/transitions/pixel-dissolve.js";

interface PixelFxRevealProps {
  children: React.ReactNode;
  className?: string;
  trigger?: "inView" | "hover";
  seed?: number;
}

const W = 320;
const H = 180;
const MIDNIGHT_PALETTE = ["#050505", "#0e130f", "#3b4a37", "#5e7a2a", "#b7d12e", "#d9d3c4"];

/**
 * Genuine PixelFX (patch-gg/pixelfx) pixel-dissolve transition overlay.
 * Renders procedural 320x180 pixel blocks into a canvas on trigger and cleans up
 * RAF + observers cleanly. Degrades to static content under prefers-reduced-motion.
 */
export function PixelFxReveal({
  children,
  className = "",
  trigger = "inView",
  seed = 7,
}: PixelFxRevealProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const playDissolve = (onDone?: () => void) => {
    if (reduced) {
      setRevealed(true);
      onDone?.();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const frame = createFrame(W, H);
    const imgData = ctx.createImageData(W, H);
    const fx = createFx(pixelDissolve, {
      color: "#050505",
      palette: MIDNIGHT_PALETTE,
      seed,
    });

    let last = performance.now();
    let elapsed = 0;
    const duration = 1.15;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;

      fx.update(dt * 1.8);
      clearFrame(frame);
      fx.draw(frame, "front");
      composite(frame, imgData.data, 0);
      ctx.putImageData(imgData, 0, 0);

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W, H);
        rafRef.current = null;
        onDone?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (reduced) {
      setRevealed(true);
      return;
    }
    if (trigger !== "inView") {
      setRevealed(true);
      return;
    }
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          setRevealed(true);
          playDissolve();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, trigger]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={trigger === "hover" ? () => playDissolve() : undefined}
      className={`relative overflow-hidden ${className}`}
    >
      <div className={`w-full h-full transition-opacity duration-300 ${revealed ? "opacity-100" : "opacity-0"}`}>
        {children}
      </div>
      {!reduced && (
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full z-20"
          style={{ imageRendering: "pixelated" }}
        />
      )}
    </div>
  );
}
