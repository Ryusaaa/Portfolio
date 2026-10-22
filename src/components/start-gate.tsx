"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";
import { getReturnPath, hasSeenBoot, markBootSeen, requestRace } from "@/lib/boot";
import { prefersReducedMotion } from "@/lib/motion";
import { playSound } from "@/lib/sound";

export function StartGate() {
  const router = useRouter();
  const clicked = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasSeenBoot()) {
      router.replace("/");
      return;
    }
    buttonRef.current?.focus({ preventScroll: true });
  }, [router]);

  const start = () => {
    if (clicked.current) return;
    clicked.current = true;
    void playSound("passing", 0.85);
    const target = getReturnPath();
    if (prefersReducedMotion()) {
      markBootSeen();
    } else {
      requestRace();
    }
    router.push(target);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#15151e]">
      <div className="-skew-x-12">
        <button
          ref={buttonRef}
          type="button"
          onClick={start}
          className="cursor-target relative inline-flex items-center bg-[#e10600] px-10 py-5 md:px-14 md:py-6 text-white transition-colors duration-200 hover:bg-white hover:text-[#15151e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span aria-hidden="true" className="absolute inset-0 border border-[#e10600] opacity-40 animate-ping" />
          <span className="skew-x-12 inline-flex items-center gap-3 font-display text-sm md:text-base font-bold uppercase tracking-[0.25em]">
            <Volume2 size={18} aria-hidden="true" />
            Start Engine
          </span>
        </button>
      </div>
    </div>
  );
}