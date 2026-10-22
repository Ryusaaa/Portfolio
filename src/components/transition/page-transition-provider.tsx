"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { SplitPanels, SectorTicks } from "./split-panels";
import { DecryptedTitle } from "./decrypted-title";
import { GSAP_EASE_INOUT, prefersReducedMotion } from "@/lib/motion";
import { playSound, preloadSounds } from "@/lib/sound";

export interface TransitionMeta {
  /** 0-based position in Selected Works; shown as P{n+1}. */
  index?: number;
  title?: string;
  /** Wait for the detail cover image (S3). False when returning to the home page. */
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

const CLOSE_S = 0.45;
const OPEN_S = 0.6;
const MIN_VISIBLE_MS = 600;
const COVER_CAP_MS = 2500;
const FAILSAFE_MS = 6000;

interface Controller {
  running: boolean;
  expectedPath: string;
  waitForCover: boolean;
  closedAt: number;
  closed: boolean;
  opening: boolean;
  ready: { path: boolean; mounted: boolean; cover: boolean };
  timers: ReturnType<typeof setTimeout>[];
  tl: gsap.core.Timeline | null;
}

const fresh = (): Controller => ({
  running: false,
  expectedPath: "",
  waitForCover: true,
  closedAt: 0,
  closed: false,
  opening: false,
  ready: { path: false, mounted: false, cover: false },
  timers: [],
  tl: null,
});

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [meta, setMeta] = useState<TransitionMeta | null>(null);

  const ctl = useRef<Controller>(fresh());
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  const paintTicks = useCallback(() => {
    const r = ctl.current.ready;
    const on = [r.path, r.mounted, r.cover];
    rootRef.current?.querySelectorAll<HTMLElement>("[data-tick]").forEach((el, i) => {
      el.dataset.on = String(on[i]);
    });
  }, []);

  const clear = useCallback(() => {
    const c = ctl.current;
    c.timers.forEach(clearTimeout);
    c.tl?.kill();
    ctl.current = fresh();
    setMeta(null); // unmounts the overlay; never leave the screen covered
  }, []);

  const open = useCallback(() => {
    const c = ctl.current;
    if (!c.running || c.opening) return;
    c.opening = true;
    c.tl?.kill();
    c.tl = gsap.timeline({ onComplete: clear });
    c.tl.to([topRef.current, botRef.current], {
      yPercent: (i: number) => (i === 0 ? -100 : 100),
      duration: OPEN_S,
      ease: GSAP_EASE_INOUT,
    });
  }, [clear]);

  const check = useCallback(() => {
    const c = ctl.current;
    if (!c.running || !c.closed || c.opening) return;
    const waited = performance.now() - c.closedAt;
    if (c.ready.cover && waited >= MIN_VISIBLE_MS) open();
    else if (c.ready.cover) c.timers.push(setTimeout(open, MIN_VISIBLE_MS - waited));
  }, [open]);

  const markReady = useCallback(
    (stage: Stage) => {
      const c = ctl.current;
      if (!c.running) return; // deep link / popstate: no overlay, no-op
      if (stage === "mounted") {
        c.ready.mounted = true;
        if (!c.waitForCover) c.ready.cover = true;
      } else {
        c.ready.cover = true;
      }
      paintTicks();
      check();
    },
    [check, paintTicks]
  );

  // S1: the pathname actually changed to the destination.
  useEffect(() => {
    const c = ctl.current;
    if (c.running && c.expectedPath && pathname === c.expectedPath && !c.ready.path) {
      c.ready.path = true;
      paintTicks();
      // Destinations that don't wait for a cover (home) light S2/S3 once the route has rendered.
      if (!c.waitForCover) {
        c.timers.push(
          setTimeout(() => {
            markReady("mounted");
          }, 50)
        );
      }
    }
  }, [pathname, paintTicks, markReady]);

  const navigate = useCallback(
    (href: string, m: TransitionMeta = {}) => {
      const c = ctl.current;
      if (c.running) return; // ignore rapid double clicks

      // Opening a project (not returning to the list): team-radio sound, played inside the click gesture.
      if (m.waitForCover !== false) void playSound("radio");

      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }

      const next = fresh();
      next.running = true;
      next.expectedPath = href.split("#")[0].split("?")[0] || "/";
      next.waitForCover = m.waitForCover ?? true;
      ctl.current = next;
      setMeta(m);

      // Failsafe: no matter what happens, the overlay is removed.
      next.timers.push(setTimeout(clear, FAILSAFE_MS));

      // The overlay mounts on the next commit; close the panels, then navigate.
      requestAnimationFrame(() => {
        const cur = ctl.current;
        if (cur !== next || !topRef.current || !botRef.current) {
          if (cur === next) clear();
          router.push(href);
          return;
        }
        gsap.set([topRef.current, botRef.current], {
          yPercent: (i: number) => (i === 0 ? -100 : 100),
        });
        cur.tl = gsap.timeline({
          onComplete: () => {
            cur.closed = true;
            cur.closedAt = performance.now();
            try {
              router.push(href);
            } catch {
              clear();
              return;
            }
            // Hard cap: open even if the cover never reports ready.
            cur.timers.push(
              setTimeout(() => {
                cur.ready.cover = true;
                paintTicks();
                open();
              }, COVER_CAP_MS)
            );
            check();
          },
        });
        cur.tl.to([topRef.current, botRef.current], { yPercent: 0, duration: CLOSE_S, ease: GSAP_EASE_INOUT });
      });
    },
    [router, clear, open, check, paintTicks]
  );

  useEffect(() => {
    preloadSounds();
    const c = ctl.current;
    return () => {
      c.timers.forEach(clearTimeout);
      c.tl?.kill();
    };
  }, []);

  const value = useMemo(() => ({ navigate, markReady }), [navigate, markReady]);
  const label = meta?.title ?? "project";

  return (
    <TransitionContext.Provider value={value}>
      {children}
      {meta && (
        <div ref={rootRef} className="fixed inset-0 z-[998]" data-transition-overlay>
          <span role="status" className="sr-only">
            {`Loading project: ${label}`}
          </span>
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <SplitPanels
              topRef={topRef}
              bottomRef={botRef}
              top={
                <div className="text-center px-6">
                  {meta.index !== undefined && (
                    <p className="font-mono text-[11px] text-[#E32119] tracking-[0.3em] mb-3">
                      P{meta.index + 1}
                    </p>
                  )}
                  {meta.title && (
                    <DecryptedTitle
                      text={meta.title}
                      className="font-display font-bold uppercase tracking-tight text-3xl md:text-6xl text-white"
                    />
                  )}
                </div>
              }
              bottom={
                <div className="w-64 md:w-96 mt-4">
                  <SectorTicks />
                </div>
              }
            />
          </div>
        </div>
      )}
    </TransitionContext.Provider>
  );
}