"use client";

import { useCallback, useSyncExternalStore } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { markBootSeen, shouldShowBoot, subscribeBoot } from "@/lib/boot";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const showBoot = useSyncExternalStore(subscribeBoot, shouldShowBoot, () => false);

  const handleComplete = useCallback(() => markBootSeen(), []);

  return (
    <>
      {children}
      {showBoot && <LoadingScreen onComplete={handleComplete} />}
    </>
  );
}