"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data";
import { SakugaVfxButton } from "./ui/sakuga-vfx-button";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { title: "Archive", href: "/", code: "00" },
  { title: "Projects", href: "/projects", code: "01" },
  { title: "Experience", href: "/experience", code: "02" },
  { title: "About", href: "/about", code: "03" },
  { title: "Contact", href: "/contact", code: "04" },
];

export function Navbar() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen, closeMenu]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[60] transition-colors duration-200 ${
          isScrolled
            ? "bg-midnight-950/92 backdrop-blur-md border-b border-midnight-700"
            : "bg-midnight-950/60 border-b border-midnight-700/50"
        }`}
      >
        <nav
          className="container mx-auto px-6 h-16 flex items-center justify-between gap-4"
          aria-label="Primary navigation"
        >
          {/* Wordmark + pixel tag */}
          <Link
            href="/"
            className="inline-flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight-500"
          >
            <span className="font-display font-bold text-base uppercase tracking-[0.18em] text-archive-paper group-hover:text-midnight-500 transition-colors">
              RYU
            </span>
            <span className="font-pixel text-[8px] text-midnight-500 border border-midnight-700 px-1.5 py-0.5 bg-midnight-900">
              ARC
            </span>
          </Link>

          {/* Desktop nav — Sakuga VFX secondary interactive buttons */}
          <ul className="hidden lg:flex items-center gap-2" role="list">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <SakugaVfxButton
                    variant="secondary"
                    impact
                    href={item.href}
                    active={active}
                    ariaLabel={`${item.title}${active ? " (current page)" : ""}`}
                    className="nav-sakuga"
                  >
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em]">
                      <span
                        aria-hidden="true"
                        className={`font-pixel text-[8px] ${
                          active ? "text-archive-paper" : "text-midnight-500"
                        }`}
                      >
                        {active ? ">" : item.code}
                      </span>
                      <span>{item.title}</span>
                    </span>
                  </SakugaVfxButton>
                </li>
              );
            })}
            <li className="pl-2">
              <ThemeToggle />
            </li>
          </ul>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              className="ma-btn inline-flex items-center gap-2 border border-midnight-700 bg-midnight-900 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-archive-paper cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-500"
            >
              <span className="font-pixel text-[8px] text-midnight-500">≡</span>
              <span>Menu</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-midnight-950/80 backdrop-blur-sm z-[64] lg:hidden"
            />
            <motion.div
              initial={reduced ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduced ? undefined : { x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed right-0 top-0 w-full max-w-sm h-screen bg-midnight-900 z-[65] flex flex-col p-6 border-l border-midnight-700 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-midnight-700 pb-4 mb-8">
                <span className="font-pixel text-[9px] text-midnight-300">MIDNIGHT // NAV</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                  className="ma-btn inline-flex items-center gap-1.5 border border-midnight-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-midnight-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-midnight-500"
                >
                  <span>Close</span>
                  <X size={14} aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile links" className="flex flex-col gap-2 flex-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-between px-4 py-3.5 border transition-all duration-200 hover:translate-x-1 ${
                        active
                          ? "border-midnight-500 bg-midnight-950 text-archive-paper"
                          : "border-midnight-700/70 text-midnight-300 hover:border-midnight-500 hover:text-archive-paper"
                      }`}
                    >
                      <span className="font-display font-semibold text-xl uppercase tracking-tight">
                        {item.title}
                      </span>
                      <span className="font-pixel text-[9px] text-midnight-500">
                        {active ? "[>]" : item.code}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-midnight-700 font-mono text-[11px] text-midnight-300 flex flex-col gap-2">
                <a href={`mailto:${SOCIAL_LINKS.email}`} className="ma-link break-all">
                  {SOCIAL_LINKS.email}
                </a>
                <div className="flex gap-4 text-midnight-500">
                  <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="ma-link">
                    GitHub ↗
                  </a>
                  <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="ma-link">
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}