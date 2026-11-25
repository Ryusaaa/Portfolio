"use client";

import { useEffect, useRef } from "react";

type CursorMode = "default" | "link" | "button" | "text";

const GLYPH: Record<CursorMode, string> = {
  default: "+",
  link: "[→]",
  button: "[#]",
  text: "[I]",
};

/**
 * MIDNIGHT ARCHIVE Pixel / ASCII desktop cursor.
 * Active only on fine pointers (hover: hover and pointer: fine) and disabled
 * on touch devices or when prefers-reduced-motion is enabled.
 * Uses direct DOM transforms inside requestAnimationFrame (zero per-move React renders).
 */
export function PixelCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);
  const blockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const el = rootRef.current;
    const glyphEl = glyphRef.current;
    const blockEl = blockRef.current;
    if (!el || !glyphEl || !blockEl) return;

    let visible = false;
    let mode: CursorMode = "default";
    let tx = -100;
    let ty = -100;
    let cx = -100;
    let cy = -100;
    let rafId: number | null = null;

    const setMode = (next: CursorMode) => {
      if (mode === next) return;
      mode = next;
      glyphEl.textContent = GLYPH[next];
      el.dataset.mode = next;
    };

    const detectMode = (target: EventTarget | null): CursorMode => {
      if (!(target instanceof Element)) return "default";
      if (target.closest("input, textarea, select, [contenteditable='true']")) return "text";
      if (target.closest("button, sakuga-button, [role='button'], [role='tab']")) return "button";
      if (target.closest("a")) return "link";
      return "default";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        cx = tx;
        cy = ty;
        el.style.opacity = "1";
        document.documentElement.classList.add("pixel-cursor-active");
      }
      setMode(detectMode(e.target));
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
      document.documentElement.classList.remove("pixel-cursor-active");
    };

    const onDown = () => {
      blockEl.style.transform = "scale(1.5)";
    };
    const onUp = () => {
      blockEl.style.transform = "scale(1)";
    };

    const loop = () => {
      cx += (tx - cx) * 0.35;
      cy += (ty - cy) * 0.35;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("pixel-cursor-active");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-mode="default"
      className="pointer-events-none fixed top-0 left-0 z-[1000] opacity-0 transition-opacity duration-150 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5"
      style={{ willChange: "transform" }}
    >
      <span
        ref={blockRef}
        className="block w-2.5 h-2.5 border border-archive-paper bg-midnight-500/40 transition-transform duration-100"
      />
      <span
        ref={glyphRef}
        className="font-mono text-[10px] leading-none text-archive-paper bg-midnight-950/85 px-1 py-0.5 border border-midnight-700"
      >
        +
      </span>
    </div>
  );
}
