"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { registerSakugaButton } from "@/lib/sakuga/button.js";

interface SakugaVfxButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  active?: boolean;
}

const emptySubscribe = () => () => {};
const getServerSnapshot = () => false;

function getClientSupport(): boolean {
  if (typeof window === "undefined" || typeof customElements === "undefined") return false;
  if (!("adoptedStyleSheets" in document)) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext && c.getContext("2d"));
  } catch {
    return false;
  }
}

/**
 * React wrapper around the MIT-licensed <sakuga-button> custom element
 * from finktheartist/sakuga-vfx, themed to MIDNIGHT ARCHIVE (--sk-* tokens).
 * Handles SSR hydration safely via useSyncExternalStore, supports Next.js
 * navigation and external links, and falls back to a calm semantic control
 * under prefers-reduced-motion or environments without canvas/adoptedStyleSheets.
 */
export function SakugaVfxButton({
  children,
  variant = "primary",
  href,
  external = false,
  onClick,
  className = "",
  ariaLabel,
  active = false,
}: SakugaVfxButtonProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const supported = useSyncExternalStore(emptySubscribe, getClientSupport, getServerSnapshot);
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (supported && !reduced) {
      registerSakugaButton();
    }
  }, [supported, reduced]);

  const handleActivate = () => {
    onClick?.();
    if (!href) return;
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  if (!supported || reduced) {
    if (href) {
      return external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          onClick={onClick}
          className={`inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${
            variant === "primary"
              ? "border-midnight-500 bg-midnight-900 text-archive-paper hover:bg-midnight-500"
              : active
              ? "border-midnight-500 bg-midnight-900 text-archive-paper"
              : "border-midnight-700 text-midnight-300 hover:border-midnight-500 hover:text-archive-paper"
          } ${className}`}
        >
          {children}
        </a>
      ) : (
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={handleActivate}
          className={`inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 border transition-colors cursor-pointer ${
            variant === "primary"
              ? "border-midnight-500 bg-midnight-900 text-archive-paper hover:bg-midnight-500"
              : active
              ? "border-midnight-500 bg-midnight-900 text-archive-paper"
              : "border-midnight-700 text-midnight-300 hover:border-midnight-500 hover:text-archive-paper"
          } ${className}`}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={handleActivate}
        className={`inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 border border-midnight-500 bg-midnight-900 text-archive-paper hover:bg-midnight-500 transition-colors cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <sakuga-button
      ref={elRef}
      variant={variant}
      aria-label={ariaLabel}
      onClick={handleActivate}
      className={`sakuga-ma-host inline-block ${active ? "sakuga-ma-active" : ""} ${className}`}
    >
      {children}
    </sakuga-button>
  );
}
