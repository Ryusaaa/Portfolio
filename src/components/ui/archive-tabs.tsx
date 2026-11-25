"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface ArchiveTab<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

interface ArchiveTabsProps<T extends string> {
  tabs: ArchiveTab<T>[];
  activeId: T;
  onChange: (id: T) => void;
  layoutId?: string;
  ariaLabel?: string;
}

/**
 * 21st.dev-derived Animated Tabs pattern (https://21st.dev), featuring a
 * Framer Motion layoutId sliding indicator adapted to MIDNIGHT ARCHIVE.
 */
export function ArchiveTabs<T extends string>({
  tabs,
  activeId,
  onChange,
  layoutId = "archive-tab-pill",
  ariaLabel = "Filter categories",
}: ArchiveTabsProps<T>) {
  const reduced = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1 border border-midnight-700 bg-midnight-900/60 p-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-500 ${
              isActive ? "text-archive-paper" : "text-midnight-300 hover:text-archive-paper"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={reduced ? undefined : layoutId}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                aria-hidden="true"
                className="absolute inset-0 bg-midnight-500/35 border border-midnight-500"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[9px] text-midnight-300 tabular-nums">
                  {String(tab.count).padStart(2, "0")}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
