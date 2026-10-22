import type { ReactNode, Ref } from "react";

interface SplitPanelsProps {
  topRef: Ref<HTMLDivElement>;
  bottomRef: Ref<HTMLDivElement>;
  top: ReactNode;
  bottom: ReactNode;
}

function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 border-l border-white"
          style={{ left: `${(i + 1) * 12.5}%` }}
        />
      ))}
    </div>
  );
}

/** Two half-screen panels that wipe in/out. Shared by the boot screen and the project-open overlay. */
export function SplitPanels({ topRef, bottomRef, top, bottom }: SplitPanelsProps) {
  return (
    <>
      <div
        ref={topRef}
        className="loading-panel absolute inset-x-0 top-0 h-1/2 bg-[#0C162F] flex flex-col items-center justify-end pb-8 overflow-hidden"
      >
        <GridLines />
        {top}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#E32119]" />
      </div>
      <div
        ref={bottomRef}
        className="loading-panel absolute inset-x-0 bottom-0 h-1/2 bg-[#0C162F] flex flex-col items-center justify-start pt-8 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#E32119]" />
        {bottom}
        <GridLines />
      </div>
    </>
  );
}

/** Progress track + counter + S1/S2/S3 ticks. Ticks and bar are driven imperatively via the returned refs' data attributes. */
export function SectorTicks({ tickClass = "" }: { tickClass?: string }) {
  return (
    <div className={`flex justify-between mt-1 ${tickClass}`}>
      {["S1", "S2", "S3"].map((s) => (
        <span
          key={s}
          data-tick={s}
          className="font-mono text-[9px] text-[#1e2f55] uppercase tracking-widest transition-colors duration-200 data-[on=true]:text-[#E32119]"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
