interface PixelCornersProps {
  size?: "sm" | "md";
  className?: string;
}

/**
 * Stepped pixel-art corner brackets in the MIDNIGHT ARCHIVE palette.
 */
export function PixelCorners({ size = "sm", className = "" }: PixelCornersProps) {
  const dim = size === "md" ? "w-3 h-3" : "w-2 h-2";
  const dot = size === "md" ? "w-[3px] h-[3px]" : "w-[2px] h-[2px]";
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-20 ${className}`}>
      <span className={`absolute -top-[1px] -left-[1px] ${dim} border-t-2 border-l-2 border-midnight-500`} />
      <span className={`absolute top-[3px] left-[3px] ${dot} bg-midnight-300/60`} />

      <span className={`absolute -top-[1px] -right-[1px] ${dim} border-t-2 border-r-2 border-midnight-500`} />
      <span className={`absolute top-[3px] right-[3px] ${dot} bg-midnight-300/60`} />

      <span className={`absolute -bottom-[1px] -left-[1px] ${dim} border-b-2 border-l-2 border-midnight-500`} />
      <span className={`absolute bottom-[3px] left-[3px] ${dot} bg-midnight-300/60`} />

      <span className={`absolute -bottom-[1px] -right-[1px] ${dim} border-b-2 border-r-2 border-midnight-500`} />
      <span className={`absolute bottom-[3px] right-[3px] ${dot} bg-midnight-300/60`} />
    </div>
  );
}

/**
 * Editorial section divider with a centered 3-pixel stepped marker.
 */
export function PixelDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`container mx-auto px-6 flex items-center gap-4 ${className}`}>
      <div className="h-[1px] flex-1 bg-midnight-700" />
      <div className="flex items-center gap-1.5">
        <span className="block w-[3px] h-[3px] bg-midnight-700" />
        <span className="block w-[5px] h-[5px] bg-midnight-500" />
        <span className="block w-[3px] h-[3px] bg-midnight-700" />
      </div>
      <div className="h-[1px] flex-1 bg-midnight-700" />
    </div>
  );
}

/**
 * Small 2x2 pixel sprite marker for section indices or active indicators.
 */
export function PixelMarker({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-grid grid-cols-2 gap-[1px] shrink-0 ${active ? "opacity-100" : "opacity-60"}`}
    >
      <span className={`w-[3px] h-[3px] ${active ? "bg-midnight-300" : "bg-midnight-500"}`} />
      <span className="w-[3px] h-[3px] bg-transparent" />
      <span className="w-[3px] h-[3px] bg-transparent" />
      <span className={`w-[3px] h-[3px] ${active ? "bg-midnight-500" : "bg-midnight-700"}`} />
    </span>
  );
}
