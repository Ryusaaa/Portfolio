"use client";

import GradientASCII from "../reactbits/gradient-ascii";

const COLORS = ["#0e130f", "#5e7a2a", "#b7d12e", "#d9d3c4"];

export function AsciiBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <GradientASCII
        colors={COLORS}
        shape="horizon"
        characters=" .:-=+*#%@"
        cellSize={16}
        density={0.85}
        glyphOpacity={0.6}
        gradientOpacity={0.4}
        glow={0.3}
        softness={0.6}
        flicker={0.2}
        speed={0.8}
        grain={0.06}
        scrambleRadius={0.12}
        clickEffect="wave"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight-950/80 via-midnight-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-midnight-950" />
    </div>
  );
}
