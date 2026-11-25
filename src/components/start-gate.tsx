"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markBootSeen } from "@/lib/boot";

export function StartGate() {
  const router = useRouter();

  useEffect(() => {
    markBootSeen();
    router.replace("/");
  }, [router]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-midnight-950">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-midnight-300">
        Redirecting to archive…
      </p>
    </div>
  );
}
