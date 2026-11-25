"use client";

import { motion, useScroll, useReducedMotion } from "framer-motion";

/**
 * Thin scroll progress indicator anchored to the top edge.
 * Uses transform-only animation (no layout repaint).
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="ma-progress-bar"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
