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
        dpr={1}
        cellSize={22}
        density={0.6}
        glyphOpacity={0.35}
        gradientOpacity={0.25}
        glow={0}
        softness={0.65}
        flicker={0.08}
        speed={0.45}
        grain={0.03}
        scrambleRadius={0.08}
        clickEffect="wave"
        intro={false}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight-950/80 via-midnight-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-midnight-950" />
    </div>
  );
}
