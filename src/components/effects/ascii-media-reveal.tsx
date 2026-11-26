"use client";

import { useRef } from "react";
import { AsciiReveal, type AsciiRevealHandle, type AsciiRevealProps } from "ascii-reveal";

interface AsciiMediaRevealProps extends Omit<AsciiRevealProps, "ref"> {
  replayOnHover?: boolean;
}

/**
 * Lightweight wrapper around `ascii-reveal`'s `<AsciiReveal>` for project media
 * and cards, with optional pointer-origin replay on hover.
 */
export function AsciiMediaReveal({
  replayOnHover = false,
  preset = "dither",
  duration = "fast",
  revealOnHydrate = true,
  lazy = true,
  className = "",
  children,
  onMouseEnter,
  ...rest
}: AsciiMediaRevealProps) {
  const revealRef = useRef<AsciiRevealHandle>(null);

  return (
    <AsciiReveal
      ref={revealRef}
      preset={preset}
      duration={duration}
      revealOnHydrate={revealOnHydrate}
      lazy={lazy}
      className={className}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        if (replayOnHover) {
          void revealRef.current?.reveal({
            origin: { x: e.clientX, y: e.clientY },
          });
        }
      }}
      {...rest}
    >
      {children}
    </AsciiReveal>
  );
}
