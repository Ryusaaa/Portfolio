"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

export interface TransitionMeta {
  index?: number;
  title?: string;
  waitForCover?: boolean;
}

type Stage = "mounted" | "cover";

interface Ctx {
  navigate: (href: string, meta?: TransitionMeta) => void;
  markReady: (stage: Stage) => void;
}

const TransitionContext = createContext<Ctx>({
  navigate: () => {},
  markReady: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

/**
 * Restrained MIDNIGHT ARCHIVE route transition:
 * Brief non-blocking ASCII/pixel scanline indicator (220ms) that immediately
 * clears on reduced motion.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [meta, setMeta] = useState<TransitionMeta | null>(null);

  const markReady = useCallback((_stage: Stage) => {
    void _stage;
  }, []);

  const navigate = useCallback(
    (href: string, m: TransitionMeta = {}) => {
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      setMeta(m);
      setTimeout(() => {
        router.push(href);
        setTimeout(() => setMeta(null), 220);
      }, 140);
    },
    [router]
  );

  const value = useMemo(() => ({ navigate, markReady }), [navigate, markReady]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {meta && (
          <motion.div
            key="archive-route-wipe"
            data-transition-overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-16 z-[55] border-b border-midnight-500 bg-midnight-950/90 px-6 py-2 flex items-center justify-between"
          >
            <span className="font-pixel text-[8px] text-midnight-300 uppercase">
              [ ARCHIVE // {meta.title ?? "ROUTE"} ]
            </span>
            <span className="font-mono text-[10px] text-midnight-500">LOADING…</span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
