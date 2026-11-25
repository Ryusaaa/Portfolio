interface AsciiRuleProps {
  label?: string;
  className?: string;
}

/**
 * Authored ASCII + pixel section divider.
 */
export function AsciiRule({ label, className = "" }: AsciiRuleProps) {
  return (
    <div
      aria-hidden="true"
      className={`container mx-auto px-6 flex items-center gap-3 font-mono text-[10px] text-midnight-500 select-none ${className}`}
    >
      <span>+---</span>
      <span className="h-[1px] flex-1 bg-midnight-700" />
      {label && (
        <span className="font-pixel text-[8px] text-midnight-300 px-2 py-0.5 border border-midnight-700 bg-midnight-900/70">
          {label}
        </span>
      )}
      <span className="h-[1px] flex-1 bg-midnight-700" />
      <span>---+</span>
    </div>
  );
}

/**
 * Compact authored ASCII signature block for hero/footer colophon.
 */
export function AsciiSignature() {
  return (
    <pre
      aria-hidden="true"
      className="font-mono text-[10px] leading-[1.35] text-midnight-500 select-none"
    >{`┌──────────────────────────────┐
│ RYUSA.TECH // ARCHIVE INDEX  │
│ 06°54'S 107°36'E  BANDUNG    │
└──────────────────────────────┘`}</pre>
  );
}
