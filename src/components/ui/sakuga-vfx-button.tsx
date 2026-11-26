"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { registerSakugaButton } from "@/lib/sakuga/button.js";
import { usePageTransition } from "@/components/transition/page-transition-provider";

interface SakugaVfxButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  active?: boolean;
  impact?: boolean;
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
  impact = false,
}: SakugaVfxButtonProps) {
  const { navigate } = usePageTransition();
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
      navigate(href);
    }
  };

  if (!supported || reduced) {
    const tone =
      variant === "primary"
        ? "border-midnight-500 bg-midnight-900 text-archive-paper"
        : "border-midnight-700 text-midnight-300";
    const base = `ma-btn inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 border cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-500 ${tone} ${className}`;

    if (href && external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          onClick={onClick}
          data-active={active}
          className={base}
        >
          {children}
        </a>
      );
    }

    return (
      <button type="button" aria-label={ariaLabel} onClick={handleActivate} data-active={active} className={base}>
        {children}
      </button>
    );
  }

  return (
    <sakuga-button
      ref={elRef}
      variant={variant}
      data-effect={impact ? "impact" : undefined}
      aria-label={ariaLabel}
      onClick={handleActivate}
      className={`sakuga-ma-host inline-block ${active ? "sakuga-ma-active" : ""} ${className}`}
    >
      {children}
    </sakuga-button>
  );
}