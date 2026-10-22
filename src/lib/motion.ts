export const EASE = [0.22, 1, 0.36, 1] as const; // framer-motion
export const GSAP_EASE_OUT = "power3.out";
export const GSAP_EASE_IN = "power2.in";
export const GSAP_EASE_INOUT = "power3.inOut";
export const DUR = { micro: 0.2, reveal: 0.6, page: 0.6 } as const;

export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;
}
