interface CoverPlateProps {
  title: string;
  /** 0-based position in Selected Works. Rendered as ghost P{n+1}. */
  index: number;
  className?: string;
}

/** Typographic stand-in for a missing cover image. Looks finished on its own. */
export function CoverPlate({ title, index, className = "" }: CoverPlateProps) {
  return (
    <div className={`absolute inset-0 bg-[#0C162F] overflow-hidden ${className}`} role="img" aria-label={title}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 border-l border-white" style={{ left: `${(i + 1) * 12.5}%` }} />
        ))}
      </div>
      <span
        aria-hidden="true"
        className="absolute right-[4%] top-1/2 -translate-y-1/2 font-display font-bold leading-none text-white/[0.04] select-none text-[28vw] md:text-[14vw]"
      >
        P{index + 1}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
        <div className="h-[2px] w-16 bg-[#E32119] mb-5" />
        <p className="font-display font-bold uppercase tracking-tight text-white text-2xl md:text-4xl leading-none max-w-[16ch]">
          {title}
        </p>
      </div>
    </div>
  );
}
