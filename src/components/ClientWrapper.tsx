"use client";

import { useCallback, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen } from "./LoadingScreen";
import { prefersReducedMotion } from "@/lib/motion";

const KEY = "boot-seen";
const listeners = new Set<() => void>();
let finishedThisLoad = false;
// Decided once, on the first client render: the boot screen belongs to the initial
// page load only, never to a later client-side visit to "/".
let bootAllowed: boolean | null = null;

function seen(): boolean {
  if (finishedThisLoad) return true;
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false; // blocked storage must not break rendering
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function markSeen() {
  finishedThisLoad = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Server snapshot is always false, so server and first client render match.
  const showBoot = useSyncExternalStore(
    subscribe,
    () => {
      if (bootAllowed === null) bootAllowed = pathname === "/" && !seen() && !prefersReducedMotion();
      return bootAllowed && !seen();
    },
    () => false
  );

  const handleComplete = useCallback(() => markSeen(), []);

  // `children` stay in the same position whether or not the overlay is shown.
  return (
    <>
      {children}
      {showBoot && <LoadingScreen onComplete={handleComplete} />}
    </>
  );
}
