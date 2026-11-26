"use client";

import Image from "next/image";
import Link from "next/link";
import { PROJECTS_DATA } from "@/lib/data";
import DecryptedText from "../reactbits/decrypted-text";
import SplitText from "../reactbits/split-text";
import Magnet from "../reactbits/magnet";
import HalftoneReveal from "../reactbits/halftone-reveal";
import { AsciiMediaReveal } from "../effects/ascii-media-reveal";
import { PixelCorners } from "../ui/pixel-details";
import { CoverPlate } from "../cover-plate";

/**
 * Dashboard Featured Project Showcase powered by:
 * - React Bits: SplitText, DecryptedText, Magnet (src/components/reactbits/*)
 * - React Bits HalftoneReveal on the featured cover
 * - PixelFX: PixelFxReveal (patch-gg/pixelfx pixel-dissolve)
 */
export function FeaturedShowcase() {
  const featured = PROJECTS_DATA[0];
  const secondary = PROJECTS_DATA.slice(1, 4);

  return (
    <section aria-labelledby="featured-heading" className="container mx-auto px-6 py-20 md:py-28">
      {/* Header using React Bits SplitText */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <span className="font-pixel text-[9px] text-midnight-500 block mb-3">
            FEATURED
          </span>
          <SplitText
            text="Selected Works"
            tag="h2"
            splitType="words"
            effect="rise"
            trigger="view"
            textAlign="left"
            delay={60}
            duration={0.7}
            className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tight text-archive-paper"
          />
        </div>
        <Link
          href="/projects"
          className="ma-link font-mono text-xs uppercase tracking-[0.2em] w-fit"
        >
          Open Full Archive ({String(PROJECTS_DATA.length).padStart(2, "0")}) <span className="ma-btn-arrow">→</span>
        </Link>
      </div>

      {/* Primary Featured Project with PixelFX reveal + React Bits DecryptedText & Magnet */}
      {featured && (
        <article className="border border-midnight-700 bg-midnight-900/50 p-6 md:p-8 mb-10 relative">
          <PixelCorners size="md" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="relative aspect-video overflow-hidden border border-midnight-700 bg-midnight-950">
                {featured.image ? (
                  <>
                    <Image
                      src={featured.image}
                      alt={`${featured.title} preview`}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover"
                    />
                    <HalftoneReveal
                      src={featured.image}
                      fit="cover"
                      mode="duotone"
                      shape="dot"
                      cellSize={7}
                      inkColor="#b7d12e"
                      accentColor="#d9d3c4"
                      paperColor="#050505"
                      revealRadius={170}
                      linger={1.4}
                      wander
                      className="absolute inset-0"
                    />
                  </>
                ) : (
                  <CoverPlate title={featured.title} index={0} />
                )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-pixel text-[8px] text-archive-paper bg-midnight-500/30 border border-midnight-500 px-2 py-1">
                    P01
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-midnight-300">
                    {featured.type} · {featured.year}
                  </span>
                </div>

                <h3 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-archive-paper mb-4">
                  <DecryptedText
                    text={featured.title}
                    animateOn="view"
                    revealDirection="start"
                    speed={40}
                    maxIterations={10}
                  />
                </h3>

                <p className="text-archive-muted text-sm md:text-base leading-relaxed font-sans mb-5">
                  {featured.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="ma-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Magnet padding={32} maxOffset={5} wrapperClassName="self-start">
                <Link
                  href={`/projects/${featured.slug}`}
                  className="ma-btn inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] px-5 py-3 border border-midnight-500 bg-midnight-950 text-archive-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight-500"
                >
                  Inspect Case Study <span className="ma-btn-arrow">→</span>
                </Link>
              </Magnet>
            </div>
          </div>
        </article>
      )}

      {/* Secondary 3-column Archive Grid with PixelFX hover/inView */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {secondary.map((project, idx) => (
          <article
            key={project.id}
            className="group border border-midnight-700 bg-midnight-900/40 hover:border-midnight-500 transition-colors flex flex-col"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="flex flex-col h-full p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-500"
            >
              <AsciiMediaReveal
                replayOnHover
                preset="dither"
                className="aspect-video border border-midnight-700 bg-midnight-950 mb-5 relative"
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <CoverPlate title={project.title} index={idx + 1} />
                )}
              </AsciiMediaReveal>

              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-[8px] text-midnight-500">
                  P0{idx + 2}
                </span>
                <span className="font-mono text-[10px] text-midnight-500 uppercase">
                  {project.year}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-archive-paper group-hover:text-midnight-300 transition-colors mb-2">
                <DecryptedText
                  text={project.title}
                  animateOn="hover"
                  speed={35}
                  maxIterations={8}
                />
              </h3>

              <p className="text-xs text-archive-muted leading-relaxed line-clamp-2 mb-4 flex-1 font-sans">
                {project.description}
              </p>

              <div className="pt-3 border-t border-midnight-700/70 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-midnight-300 group-hover:text-archive-paper">
                <span>{project.type}</span>
                <span>Open →</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
