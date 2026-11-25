"use client";

import { ScrollProgress } from "./ui/scroll-progress";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      {children}
    </>
  );
}
