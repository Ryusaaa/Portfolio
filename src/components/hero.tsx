"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/data";
import { SakugaVfxButton } from "./ui/sakuga-vfx-button";
import { PixelCorners, PixelMarker } from "./ui/pixel-details";
import { AsciiBackdrop } from "./dashboard/ascii-backdrop";
import { AsciiPortrait } from "./effects/ascii-potrait";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] mt-16 flex flex-col justify-center overflow-hidden bg-midnight-950 py-14 md:py-20"
      aria-label="Introduction"
    >
      <AsciiBackdrop />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* ── Left: Editorial identity + Sakuga CTAs ─────────── */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <PixelMarker active />
              <span className="font-pixel text-[9px] text-archive-paper bg-midnight-900 border border-midnight-700 px-2 py-1">
                ARCHIVE // 001
              </span>
              <span className="coord-label">BANDUNG, INDONESIA</span>
            </motion.div>

            <h1 className="font-display font-bold text-[clamp(2.75rem,8vw,6.25rem)] leading-[0.92] tracking-[-0.02em] uppercase mb-6">
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-archive-paper"
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
                >
                  Satria Ibnu
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-midnight-300"
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.75, ease: EASE, delay: 0.16 }}
                >
                  Safarudin
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.32 }}
              className="mb-8"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-midnight-500 mb-3">
                SOFTWARE / BACKEND / SYSTEMS
              </p>
              <p className="text-archive-muted text-lg md:text-xl leading-relaxed max-w-xl font-sans">
                I build reliable web systems, backend services, APIs, and database-backed
                applications that connect data, workflows, and people.
              </p>
            </motion.div>

            {/* Primary Sakuga VFX CTAs */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.44 }}
              className="flex flex-wrap items-center gap-4"
            >
              <SakugaVfxButton variant="primary" href="/projects">
                Explore Projects →
              </SakugaVfxButton>
              <SakugaVfxButton variant="secondary" href="/contact">
                Contact
              </SakugaVfxButton>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ma-link font-mono text-xs uppercase tracking-[0.2em] px-2 py-2"
              >
                GitHub ↗
              </a>
            </motion.div>

            {/* Authored metadata strip */}
            <div className="mt-12 pt-6 border-t border-midnight-700 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
              <div>
                <span className="font-pixel text-[8px] text-midnight-500 block mb-1.5">ROLE</span>
                <span className="text-archive-paper">Early-career Backend / Full-Stack</span>
              </div>
              <div>
                <span className="font-pixel text-[8px] text-midnight-500 block mb-1.5">FOCUS</span>
                <span className="text-archive-paper">APIs · Databases · Security · AI</span>
              </div>
              <div>
                <span className="font-pixel text-[8px] text-midnight-500 block mb-1.5">LOCATION</span>
                <span className="text-archive-paper">Bandung, Indonesia</span>
              </div>
            </div>
          </div>

          {/* ── Right: ASCII portrait anchor ───────────────── */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
              className="relative bg-midnight-900/50 p-3 border border-midnight-700"
            >
              <PixelCorners size="md" />

              <div
                aria-hidden="true"
                className="flex items-center justify-between font-mono text-[10px] text-midnight-500 pb-2 mb-2 border-b border-midnight-700/80"
              >
                <span>+--- PORTRAIT.ASCII</span>
                <span className="font-pixel text-[8px] text-midnight-300">ASCII</span>
              </div>

              <AsciiPortrait className="w-[240px] sm:w-[280px] lg:w-[320px] border border-midnight-700" />

              <div
                aria-hidden="true"
                className="flex items-center justify-between font-mono text-[10px] text-midnight-500 pt-2 mt-2 border-t border-midnight-700/80"
              >
                <span>ryusa.tech</span>
                <span>[01 // SATRIA]</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}