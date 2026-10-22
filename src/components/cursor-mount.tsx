"use client";

import TargetCursor from "./reactbits/target-cursor";

/**
 * Single site-wide cursor. The component gates itself to fine pointers
 * (hover: hover and pointer: fine), waits for the first pointer event, removes
 * all listeners on unmount, and turns off spin under reduced motion.
 */
export function CursorMount() {
  return (
    <TargetCursor
      targetSelector=".cursor-target"
      cursorColor="#ffffff"
      cursorColorOnTarget="#e10600"
      blendMode="normal"
      hoverDuration={0.15}
      parallaxOn={false}
    />
  );
}
