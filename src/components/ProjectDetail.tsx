"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailProps {
  project: Project;
}

/* ── Animation Variants ─────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── Lightbox ────────────────────────────────────────── */
interface LightboxProps {
  images: string[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, activeIndex, onClose, onPrev, onNext }: LightboxProps) {
  // Close on Escape, navigate with arrow keys
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, onClose, onPrev, onNext]);

  // Prevent body scroll when open
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {activeIndex !== null && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#a1a1aa]">
            FRAME{" "}
            <span className="text-[#e10600]">
              {String((activeIndex ?? 0) + 1).padStart(2, "0")}
            </span>{" "}
            / {String(images.length).padStart(2, "0")}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-5 right-6 font-mono text-[11px] uppercase tracking-widest text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-2 z-10"
          >
            <span className="text-base leading-none">✕</span> ESC
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 font-mono text-2xl text-[#a1a1aa] hover:text-[#e10600] transition-colors z-10 p-2"
          >
            ←
          </button>

          {/* Image */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[90vw] max-w-5xl aspect-video border border-[#38383f]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`Frame ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#e10600] tracking-widest">
                FRAME {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[9px] text-[#a1a1aa] tracking-widest">
                USE ← → TO NAVIGATE
              </span>
            </div>
          </motion.div>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next image"
            className="absolute right-4 md:right-8 font-mono text-2xl text-[#a1a1aa] hover:text-[#e10600] transition-colors z-10 p-2"
          >
            →
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto px-2 pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); /* jump to index */ onClose(); setTimeout(() => {}, 0); }}
                aria-label={`Go to frame ${i + 1}`}
                className={`relative flex-shrink-0 w-14 h-9 border transition-all duration-200 overflow-hidden ${
                  i === activeIndex
                    ? "border-[#e10600] opacity-100"
                    : "border-[#38383f] opacity-40 hover:opacity-70"
                }`}
              >
                <Image src={src} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Sub-components ─────────────────────────────────── */
function HeroSection({ project }: { project: Project }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(titleRef.current, { y: 80, opacity: 0, duration: 0.9 }, 0)
      .from(metaRef.current, { y: 20, opacity: 0, duration: 0.6 }, 0.5);
  }, []);

  return (
    <section className="relative min-h-[60vh] flex flex-col justify-end bg-[#15151e] border-b border-[#38383f] pb-0 overflow-hidden">
      {/* Top pinstripe */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#e10600]" />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l border-white/[0.03]"
            style={{ left: `${(i + 1) * (100 / 7)}%` }}
          />
        ))}
      </div>

      {/* Large ghost number */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 font-display font-bold text-[20vw] leading-none text-white/[0.02] select-none pointer-events-none">
        {String(1).padStart(2, "0")}
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-24 pb-16 relative z-10">
        {/* Sector label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] text-[#e10600] uppercase tracking-[0.25em]">
            Project Telemetry
          </span>
          <div className="h-[1px] w-12 bg-[#e10600]" />
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display font-bold text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tight uppercase text-white mb-8"
        >
          {project.title}
        </h1>

        {/* F1 red rule — scaleX draw */}
        <motion.div
          ref={ruleRef}
          className="h-[2px] bg-[#e10600] mb-6 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
        />

        {/* Role + Year telemetry */}
        <div ref={metaRef} className="flex flex-wrap items-center gap-6">
          <div>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-1">
              Role
            </p>
            <p className="font-mono text-sm md:text-base text-white">{project.role}</p>
          </div>
          <div className="w-[1px] h-8 bg-[#38383f]" />
          <div>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-1">
              Year
            </p>
            <p className="font-mono text-sm md:text-base text-white">{project.year}</p>
          </div>
          <div className="w-[1px] h-8 bg-[#38383f]" />
          <div>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-1">
              Stack
            </p>
            <p className="font-mono text-sm md:text-base text-[#ff2a00]">
              {String(project.tags.length).padStart(2, "0")} MODULES
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AestheticImageSection({ project }: { project: Project }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    gsap.fromTo(
      wrap,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      img,
      { scale: 1.06 },
      {
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full aspect-[16/7] overflow-hidden border-b border-[#38383f]">
      <div ref={imgRef} className="absolute inset-0">
        <Image
          src={project.aestheticImage}
          alt={`${project.title} aesthetic`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#15151e]/60 via-transparent to-[#15151e]/20" />
      </div>
    </div>
  );
}

function ConceptSection({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const words = project.description.split(" ");

  return (
    <section className="border-b border-[#38383f]">
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 md:gap-16">
          {/* Left: vertical CONCEPT label */}
          <div className="hidden md:flex items-start justify-center pt-1">
            <span className="writing-vertical font-mono text-[10px] uppercase tracking-[0.3em] text-[#e10600] select-none">
              CONCEPT
            </span>
          </div>

          {/* Mobile label */}
          <div className="md:hidden flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#e10600]">
              CONCEPT
            </span>
            <div className="h-[1px] flex-1 bg-[#38383f]" />
          </div>

          {/* Right: description with word-by-word stagger */}
          <div ref={ref}>
            <motion.p
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="font-sans text-base md:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl"
              aria-label={project.description}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="inline-block mr-[0.28em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStackSection({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="border-b border-[#38383f]">
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 md:gap-16">
          {/* Left label */}
          <div className="hidden md:flex items-start justify-center pt-1">
            <span className="writing-vertical font-mono text-[10px] uppercase tracking-[0.3em] text-[#e10600] select-none">
              STACK
            </span>
          </div>

          {/* Mobile label */}
          <div className="md:hidden flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#e10600]">
              STACK
            </span>
            <div className="h-[1px] flex-1 bg-[#38383f]" />
          </div>

          <div ref={ref}>
            {/* Section heading */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a1a1aa]">
                Tech Modules
              </h2>
              <div className="h-[1px] flex-1 bg-[#38383f]" />
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-wrap gap-3"
            >
              {project.tags.map((tag, i) => (
                <motion.span
                  key={i}
                  variants={badgeVariants}
                  className="sector-badge"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length
    );
  }, [images.length]);

  return (
    <>
      <Lightbox
        images={images}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
      />

      <section className="border-b border-[#38383f]">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
          {/* Heading */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#e10600]">
              Gallery
            </span>
            <div className="h-[1px] flex-1 bg-[#38383f]" />
            <span className="font-mono text-[10px] text-[#38383f]">
              {String(images.length).padStart(2, "0")} FRAMES
            </span>
          </div>

          {/* Horizontal scroll strip */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="gallery-scroll flex gap-4 pb-4"
          >
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                aria-label={`Open frame ${i + 1} in full view`}
                className="relative flex-shrink-0 w-[280px] md:w-[400px] aspect-video overflow-hidden border border-[#38383f] group cursor-zoom-in focus:outline-none focus:ring-1 focus:ring-[#e10600]"
              >
                <Image
                  src={src}
                  alt={`Screenshot ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="400px"
                />

                {/* Hover overlay with zoom hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-[10px] uppercase tracking-widest text-white border border-white/40 px-3 py-1.5">
                    VIEW FULL
                  </span>
                </div>

                {/* Frame number overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="font-mono text-[9px] text-[#e10600] tracking-widest">
                    FRAME {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Helper text */}
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#38383f]">
            CLICK ANY FRAME TO EXPAND
          </p>
        </div>
      </section>
    </>
  );
}

function BackButton() {
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/#projects");
    }
  }, [router]);

  useGSAP(
    () => {
      const btn = btnRef.current;
      const arrow = arrowRef.current;
      if (!btn || !arrow) return;

      const enterHandler = () => {
        gsap.to(arrow, { x: -4, duration: 0.2, ease: "power2.out" });
        gsap.to(btn, { color: "#ffffff", duration: 0.2, ease: "power2.out" });
      };
      const leaveHandler = () => {
        gsap.to(arrow, { x: 0, duration: 0.2, ease: "power2.out" });
        gsap.to(btn, { color: "#666666", duration: 0.2, ease: "power2.out" });
      };

      btn.addEventListener("mouseenter", enterHandler);
      btn.addEventListener("mouseleave", leaveHandler);

      return () => {
        btn.removeEventListener("mouseenter", enterHandler);
        btn.removeEventListener("mouseleave", leaveHandler);
      };
    },
    { scope: btnRef }
  );

  return (
    <div className="fixed top-6 left-6 md:top-10 md:left-12 z-50">
      <motion.button
        ref={btnRef}
        id="back-to-grid-btn"
        onClick={handleBack}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-0 font-mono text-xs uppercase tracking-[0.25em] bg-transparent border-0 outline-none cursor-pointer p-0"
        style={{ color: "#666666" }}
        aria-label="Back to projects grid"
      >
        <span ref={arrowRef} className="inline-block mr-2">
          ←
        </span>
        BACK TO GRID
      </motion.button>
    </div>
  );
}

/* ── Bottom Back to Home Link ─────────────────────────── */
function BottomHomeLink() {
  return (
    <section className="border-t border-[#38383f]">
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left: label */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a1a1aa] mb-2">
              Navigation
            </p>
            <p className="font-mono text-xs text-[#38383f]">
              END OF TELEMETRY
            </p>
          </div>

          {/* Right: CTA */}
          <Link
            href="/#projects"
            className="group flex items-center gap-4 font-mono text-sm uppercase tracking-widest text-[#666666] hover:text-white transition-colors duration-300"
          >
            {/* Red pill accent */}
            <span className="block w-8 h-[2px] bg-[#e10600] transition-all duration-300 group-hover:w-16" />
            <span>Back to Projects</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Main Export ──────────────────────────────────────── */
export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#15151e] text-white"
    >
      <BackButton />
      <HeroSection project={project} />
      <AestheticImageSection project={project} />
      <ConceptSection project={project} />
      <TechStackSection project={project} />
      {project.detailImages && project.detailImages.length > 0 && (
        <GallerySection images={project.detailImages} />
      )}
      <BottomHomeLink />
    </motion.main>
  );
}