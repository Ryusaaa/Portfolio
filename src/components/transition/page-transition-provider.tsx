"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { prefersReducedMotion, REDUCED_MOTION } from "@/lib/motion";
import { RouteLoader, type LoaderMode } from "./route-loader";

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

const INTRO_KEY = "portfolio-intro-seen";
const INTRO_MS = 1800;
const REPEAT_INTRO_MS = 700;
const ROUTE_MS = 650;
const COVER_MS = 440;
const REVEAL_MS = 520;
const FAILSAFE_MS = 6000;

const ROUTE_LABELS: Record<string, string> = {
  "/": "Archive",
  "/projects": "Projects",
  "/experience": "Experience",
  "/about": "About",
  "/contact": "Contact",
};

function labelFor(path: string, title?: string) {
  if (title) return title;
  if (ROUTE_LABELS[path]) return ROUTE_LABELS[path];
  const last = path.split("/").filter(Boolean).pop() ?? "Archive";
  return last.replace(/-/g, " ");
}

function subscribeMotion(cb: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener?.("change", cb);
  return () => query.removeEventListener?.("change", cb);
}

interface Overlay {
  visible: boolean;
  covered: boolean;
  mode: LoaderMode;
  label: string;
  run: number;
  duration: number;
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
  const [overlay, setOverlay] = useState<Overlay>({
    visible: true,
    covered: true,
    mode: "intro",
    label: "Archive",
    run: 0,
    duration: INTRO_MS,
  });
  const pathRef = useRef(pathname);
  const pendingRef = useRef<{ startedAt: number } | null>(null);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const reveal = useCallback(() => {
    setOverlay((o) => ({ ...o, covered: false }));
    later(() => setOverlay((o) => (o.covered ? o : { ...o, visible: false })), REVEAL_MS + 80);
  }, [later]);

  const cover = useCallback((label: string) => {
    setOverlay((o) => ({
      visible: true,
      covered: true,
      mode: "route",
      label,
      run: o.run + 1,
      duration: ROUTE_MS,
    }));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    const duration = seen ? REPEAT_INTRO_MS : INTRO_MS;
    later(() => setOverlay((o) => ({ ...o, duration, run: o.run + 1 })), 0);

    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const fonts = document.fonts?.ready?.then(() => undefined) ?? Promise.resolve();
    const minimum = new Promise<void>((resolve) => later(resolve, duration + 120));
    const cap = new Promise<void>((resolve) => later(resolve, FAILSAFE_MS));
    Promise.race([Promise.all([loaded, fonts, minimum]), cap]).then(reveal);

    return clearTimers;
  }, [later, reveal, clearTimers]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", overlay.visible);
  }, [overlay.visible]);

  useEffect(() => {
    if (pathRef.current === pathname) return;
    pathRef.current = pathname;
    if (prefersReducedMotion()) return;
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (pending) {
      const wait = Math.max(0, ROUTE_MS - (performance.now() - pending.startedAt));
      later(reveal, wait);
      return;
    }
    later(() => cover(labelFor(pathname)), 0);
    later(reveal, 450);
  }, [pathname, cover, reveal, later]);

  const navigate = useCallback(
    (href: string, m: TransitionMeta = {}) => {
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      const target = new URL(href, window.location.href);
      if (target.pathname === window.location.pathname) {
        router.push(href);
        return;
      }
      clearTimers();
      pendingRef.current = { startedAt: performance.now() };
      cover(labelFor(target.pathname, m.title));
      later(() => router.push(href), COVER_MS);
      later(() => {
        if (pendingRef.current) {
          pendingRef.current = null;
          reveal();
        }
      }, FAILSAFE_MS);
    },
    [router, cover, reveal, later, clearTimers]
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (prefersReducedMotion()) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);

  const markReady = useCallback((_stage: Stage) => {
    void _stage;
  }, []);

  const value = useMemo(() => ({ navigate, markReady }), [navigate, markReady]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      {overlay.visible && !reduced && (
        <RouteLoader
          covered={overlay.covered}
          mode={overlay.mode}
          label={overlay.label}
          run={overlay.run}
          duration={overlay.duration}
        />
      )}
    </TransitionContext.Provider>
  );
}
