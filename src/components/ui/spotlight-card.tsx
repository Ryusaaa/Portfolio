"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 21st.dev-derived Spotlight Card pattern (https://21st.dev), adapted to
 * MIDNIGHT ARCHIVE (#1c2541 surface, #3a506b border, #557a95 radial spotlight).
 * Disabled under prefers-reduced-motion and non-hover devices.
 */
export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !reduced && setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden border border-midnight-700 bg-midnight-900/70 transition-colors duration-200 hover:border-midnight-500 ${className}`}
    >
      {!reduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, rgba(85, 122, 149, 0.16), transparent 65%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
