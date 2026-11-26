"use client";

import GradientASCII from "../reactbits/gradient-ascii";
import { useTheme } from "../theme-provider";

const DARK_COLORS = ["#0e130f", "#5e7a2a", "#b7d12e", "#d9d3c4"];
const LIGHT_COLORS = ["#141813", "#3b4a37", "#4c6620", "#68872d"];

export function AsciiBackdrop() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-opacity duration-300">
      <GradientASCII
        colors={isLight ? LIGHT_COLORS : DARK_COLORS}
        lightMode={isLight}
        shape="horizon"
        characters=" .:-=+*#%@"
        dpr={1}
        cellSize={22}
        density={isLight ? 0.72 : 0.6}
        glyphOpacity={isLight ? 0.52 : 0.35}
        gradientOpacity={isLight ? 0.28 : 0.25}
        glow={0}
        softness={0.65}
        flicker={0.08}
        speed={0.45}
        grain={0.03}
        scrambleRadius={0.08}
        clickEffect="wave"
        intro={false}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r to-transparent ${
          isLight
            ? "from-midnight-950/55 via-midnight-950/15"
            : "from-midnight-950/80 via-midnight-950/30"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-midnight-950" />
    </div>
  );
}
