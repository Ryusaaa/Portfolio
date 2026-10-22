"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Project } from "@/lib/projects";
import { EASE, REDUCED_MOTION } from "@/lib/motion";
import { TransitionLink } from "./transition/transition-link";
import { usePageTransition } from "./transition/page-transition-provider";
import { DecryptedTitle } from "./transition/decrypted-title";
import { Magnet } from "./magnetic-cta";
import { CoverPlate } from "./cover-plate";
import SplitText from "./reactbits/split-text";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProjectDetailProps {
  project: Project;
  /** 0-based position in Selected Works. */
  index: number;
  next: { slug: string; title: string; index: number };
}

const pad = (n: number) => String(n).padStart(2, "0");

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const wordVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};
const badgeVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
};

/* ── Lightbox ────────────────────────────────────────── */
interface LightboxProps {
  images: string[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}

function Lightbox({ images, activeIndex, onClose, onPrev, onNext, onSelect }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = activeIndex !== null;

  // Keys + focus trap
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, onPrev, onNext]);

  // Scroll lock + focus in on open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Preload neighbours
  useEffect(() => {
    if (activeIndex === null) return;
    [activeIndex - 1, activeIndex + 1].forEach((i) => {
      const src = images[(i + images.length) % images.length];
      if (src) new window.Image().src = src;
    });
  }, [activeIndex, images]);

  return (
    <AnimatePresence>
      {activeIndex !== null && (
        <motion.div
          key="lightbox-backdrop"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Project screenshots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
          onClick={onClose}
        >
          <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8fa0c0]">
            FRAME <span className="text-[#E32119]">{pad(activeIndex + 1)}</span> / {pad(images.length)}
          </div>

          <button
            data-close
            onClick={onClose}
            aria-label="Close lightbox"
            className="cursor-target absolute top-5 right-6 font-mono text-[11px] uppercase tracking-widest text-[#8fa0c0] hover:text-white transition-colors flex items-center gap-2 z-10 focus-visible:outline-2 focus-visible:outline-[#E32119]"
          >
            <span className="text-base leading-none">✕</span> ESC
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous image"
            className="cursor-target absolute left-4 md:left-8 font-mono text-2xl text-[#8fa0c0] hover:text-[#E32119] transition-colors z-10 p-2 focus-visible:outline-2 focus-visible:outline-[#E32119]"
          >
            ←
          </button>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="relative w-[90vw] max-w-5xl aspect-video border border-[#1e2f55] bg-[#111d3e]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`Frame ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 1024px, 90vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#E32119] tracking-widest">FRAME {pad(activeIndex + 1)}</span>
              <span className="font-mono text-[9px] text-[#8fa0c0] tracking-widest">USE ← → TO NAVIGATE</span>
            </div>
          </motion.div>

          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next image"
            className="cursor-target absolute right-4 md:right-8 font-mono text-2xl text-[#8fa0c0] hover:text-[#E32119] transition-colors z-10 p-2 focus-visible:outline-2 focus-visible:outline-[#E32119]"
          >
            →
          </button>

          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto px-2 pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => onSelect(i)}
                aria-label={`Go to frame ${i + 1}`}
                aria-current={i === activeIndex}
                className={`cursor-target relative flex-shrink-0 w-14 h-9 border bg-[#111d3e] overflow-hidden transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-[#E32119] ${
                  i === activeIndex ? "border-[#E32119] opacity-100" : "border-[#1e2f55] opacity-40 hover:opacity-70"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Scroll progress ─────────────────────────────────── */
function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#E32119] origin-left z-[70] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

/* ── Breadcrumb (replaces the floating back button) ──── */
function Breadcrumb({ project, index }: { project: Project; index: number }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em]">
      <TransitionLink
        href={`/#work-${project.slug}`}
        transition={{ index, title: "Selected Works", waitForCover: false }}
        className="cursor-target back-btn group text-[#8fa0c0] hover:text-white transition-colors duration-200"
      >
        <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span>
        Selected Works
      </TransitionLink>
      <span aria-hidden="true" className="text-[#1e2f55]">/</span>
      <span className="text-[#8fa0c0]" aria-current="page">
        <span className="text-[#E32119]">P{index + 1}</span> — {project.title}
      </span>
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────── */
function HeroSection({ project, index }: { project: Project; index: number }) {
  return (
    <section className="relative min-h-[60vh] flex flex-col justify-end bg-[#0C162F] border-b border-[#1e2f55] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#E32119]" />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 border-l border-white/[0.03]" style={{ left: `${(i + 1) * (100 / 7)}%` }} />
        ))}
      </div>

      <div aria-hidden="true" className="absolute right-8 top-1/2 -translate-y-1/2 font-display font-bold text-[20vw] leading-none text-white/[0.02] select-none pointer-events-none">
        P{pad(index + 1)}
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-16 relative z-10">
        <Breadcrumb project={project} index={index} />

        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] text-[#E32119] uppercase tracking-[0.25em]">
            <DecryptedTitle text="PROJECT TELEMETRY" className="font-mono text-[10px] uppercase tracking-[0.25em]" />
          </span>
          <div className="h-[1px] w-12 bg-[#E32119]" />
        </div>

        <SplitText
          text={project.title}
          tag="h1"
          splitType="words"
          effect="rise"
          trigger="load"
          mask
          textAlign="left"
          delay={80}
          duration={0.9}
          className="font-display font-bold text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] leading-[0.95] tracking-tight uppercase text-white mb-8 break-words"
        />

        <motion.div
          className="h-[2px] bg-[#E32119] mb-6 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
          className="flex flex-wrap items-start gap-x-6 gap-y-4"
        >
          <div className="max-w-full">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-1">Role</p>
            <p className="font-mono text-sm md:text-base text-white">{project.role}</p>
          </div>
          <div className="hidden sm:block w-[1px] h-8 bg-[#1e2f55]" />
          <div>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-1">Year</p>
            <p className="font-mono text-sm md:text-base text-white">{project.year}</p>
          </div>
          <div className="hidden sm:block w-[1px] h-8 bg-[#1e2f55]" />
          <div>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-1">Stack</p>
            <p className="font-mono text-sm md:text-base text-[#E32119]">{pad(project.tags.length)} MODULES</p>
          </div>
          {project.detailImages && project.detailImages.length > 0 && (
            <>
              <div className="hidden sm:block w-[1px] h-8 bg-[#1e2f55]" />
              <div>
                <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-1">Frames</p>
                <p className="font-mono text-sm md:text-base text-white">{pad(project.detailImages.length)}</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Cover image (drives transition stage S3) ────────── */
function CoverSection({ project, index }: { project: Project; index: number }) {
  const { markReady } = usePageTransition();
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const reportedRef = useRef(false);

  const report = useCallback(
    async (img: HTMLImageElement | null) => {
      if (reportedRef.current) return;
      reportedRef.current = true;
      try {
        await img?.decode();
      } catch {
        /* decode can reject for already-decoded or broken images; still ready */
      }
      // Fade the image in via a data attribute (no state update needed).
      imgWrapRef.current?.querySelector("img")?.setAttribute("data-loaded", "true");
      markReady("cover");
    },
    [markReady]
  );

  useEffect(() => {
    markReady("mounted");
    if (!project.aestheticImage) {
      reportedRef.current = true;
      markReady("cover");
      return;
    }
    // The image may have finished loading before hydration, so onLoad would never fire.
    const img = imgWrapRef.current?.querySelector("img");
    if (img && img.complete && img.naturalWidth > 0) void report(img);
    // Failsafe so a broken image never blocks the overlay (the provider also caps at 2.5 s).
  }, [markReady, project.aestheticImage, report]);

  // Scoped entrance for the image (no global ScrollTrigger kills).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`not all and ${REDUCED_MOTION}`, () => {
        gsap.fromTo(
          "[data-cover-inner]",
          { scale: 1.06 },
          { scale: 1, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: imgWrapRef.current, start: "top 85%", once: true } }
        );
      });
    },
    { scope: imgWrapRef }
  );

  return (
    <div ref={imgWrapRef} className="relative w-full aspect-[16/7] overflow-hidden border-b border-[#1e2f55] bg-[#111d3e]">
      <div data-cover-inner className="absolute inset-0">
        {project.aestheticImage ? (
          <>
            <Image
              src={project.aestheticImage}
              alt={`${project.title} aesthetic`}
              fill
              priority
              sizes="100vw"
              onLoad={(e) => void report(e.currentTarget)}
              onError={() => void report(null)}
              className="object-cover opacity-0 transition-opacity duration-[250ms] data-[loaded=true]:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C162F]/60 via-transparent to-[#0C162F]/20" />
          </>
        ) : (
          <CoverPlate title={project.title} index={index} />
        )}
      </div>
    </div>
  );
}

/* ── Section shell ───────────────────────────────────── */
function SectionShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-[#1e2f55]">
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 md:gap-16">
          <div className="hidden md:flex items-start justify-center pt-1">
            <span className="writing-vertical font-mono text-[10px] uppercase tracking-[0.3em] text-[#E32119] select-none">{label}</span>
          </div>
          <div className="md:hidden flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#E32119]">{label}</span>
            <div className="h-[1px] flex-1 bg-[#1e2f55]" />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

function ConceptSection({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = project.description.split(" ");
  return (
    <SectionShell label="CONCEPT">
      <div ref={ref}>
        <motion.p
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="font-sans text-base md:text-lg text-[#8fa0c0] leading-relaxed max-w-3xl"
          aria-label={project.description}
        >
          {words.map((word, i) => (
            <motion.span key={i} variants={wordVariants} aria-hidden="true" className="inline-block mr-[0.28em]">
              {word}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </SectionShell>
  );
}

function TechStackSection({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <SectionShell label="STACK">
      <div ref={ref}>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8fa0c0]">Tech Modules</h2>
          <div className="h-[1px] flex-1 bg-[#1e2f55]" />
        </div>
        <motion.div variants={containerVariants} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <motion.span key={tag} variants={badgeVariants} className="sector-badge">
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </SectionShell>
  );
}

function RepoLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-target group flex items-center gap-4 font-mono text-sm uppercase tracking-widest text-[#8fa0c0] hover:text-[#E32119] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E32119]"
    >
      <span className="block w-8 h-[1px] bg-[#1e2f55] transition-colors duration-300 group-hover:bg-[#E32119]" />
      <span>{label}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
    </Link>
  );
}

function LinksSection({ project }: { project: Project }) {
  if (!project.githubFrontend && !project.githubBackend) return null;
  return (
    <SectionShell label="LINKS">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8fa0c0]">Repositories</h2>
        <div className="h-[1px] flex-1 bg-[#1e2f55]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        {project.githubFrontend && <RepoLink href={project.githubFrontend} label="Frontend Repo" />}
        {project.githubBackend && <RepoLink href={project.githubBackend} label="Backend Repo" />}
      </div>
    </SectionShell>
  );
}

function GalleryFrame({ src, i, onOpen }: { src: string; i: number; onOpen: (i: number, el: HTMLButtonElement) => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      onClick={(e) => onOpen(i, e.currentTarget)}
      aria-label={`Open frame ${i + 1} in full view`}
      className="cursor-target relative flex-shrink-0 w-[280px] md:w-[400px] aspect-video overflow-hidden border border-[#1e2f55] bg-[#111d3e] group cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E32119]"
    >
      {!loaded && (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] text-[#1e2f55]">
          FRAME {pad(i + 1)}
        </span>
      )}
      <Image
        src={src}
        alt={`Screenshot ${i + 1}`}
        fill
        sizes="(min-width: 768px) 400px, 280px"
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-[opacity,transform] duration-[250ms] group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <span className="absolute bottom-0 left-0 px-3 py-2 font-mono text-[9px] text-[#E32119] tracking-widest">
        FRAME {pad(i + 1)}
      </span>
    </button>
  );
}

function GallerySection({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState<number | null>(null);

  const open = useCallback((i: number, el: HTMLButtonElement) => {
    openerRef.current = el;
    setActive(i);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    // Return focus to the frame that opened the lightbox.
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);
  const prev = useCallback(() => setActive((p) => (p === null ? null : (p - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() => setActive((p) => (p === null ? null : (p + 1) % images.length)), [images.length]);

  return (
    <>
      <Lightbox images={images} activeIndex={active} onClose={close} onPrev={prev} onNext={next} onSelect={setActive} />
      <section className="border-b border-[#1e2f55]">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#E32119]">Gallery</span>
            <div className="h-[1px] flex-1 bg-[#1e2f55]" />
            <span className="font-mono text-[10px] text-[#8fa0c0]">{pad(images.length)} FRAMES</span>
          </div>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="gallery-scroll flex gap-4 pb-4"
          >
            {images.map((src, i) => (
              <GalleryFrame key={src} src={src} i={i} onOpen={open} />
            ))}
          </motion.div>
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8fa0c0]">Click any frame to expand</p>
        </div>
      </section>
    </>
  );
}

/* ── Next project end card ───────────────────────────── */
function NextProject({ next }: { next: ProjectDetailProps["next"] }) {
  return (
    <section className="border-t border-[#1e2f55]">
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="flex items-center justify-between mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8fa0c0]">
            Next — <span className="text-[#E32119]">P{next.index + 1}</span>
          </p>
          <TransitionLink
            href="/#projects"
            transition={{ title: "Selected Works", waitForCover: false }}
            className="cursor-target font-mono text-[10px] uppercase tracking-[0.25em] text-[#8fa0c0] hover:text-white transition-colors"
          >
            Back to all works
          </TransitionLink>
        </div>
        <TransitionLink
          href={`/projects/${next.slug}`}
          transition={{ index: next.index, title: next.title, waitForCover: true }}
          aria-label={`Next project: ${next.title}`}
          data-cursor-label="NEXT"
          className="cursor-target group block border-t border-[#1e2f55] pt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E32119]"
        >
          <h2 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-4xl md:text-6xl leading-none text-white break-words mb-8">
            {next.title}
          </h2>
          <Magnet padding={40} maxOffset={6} wrapperClassName="inline-block">
            <span className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest px-5 py-3 border border-[#E32119] text-white transition-colors duration-[220ms] group-hover:bg-[#E32119] group-focus-visible:bg-[#E32119]">
              Next Project
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </Magnet>
        </TransitionLink>
      </div>
    </section>
  );
}

/* ── Main export ─────────────────────────────────────── */
export function ProjectDetail({ project, index, next }: ProjectDetailProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="min-h-screen bg-[#0C162F] text-white"
    >
      <ScrollProgress />
      <HeroSection project={project} index={index} />
      <CoverSection project={project} index={index} />
      <ConceptSection project={project} />
      <TechStackSection project={project} />
      <LinksSection project={project} />
      {project.detailImages && project.detailImages.length > 0 && <GallerySection images={project.detailImages} />}
      <NextProject next={next} />
    </motion.article>
  );
}
