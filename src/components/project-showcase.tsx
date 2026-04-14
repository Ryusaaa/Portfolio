"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS_DATA } from "@/lib/data";

/* ── Slug map ────────────────────────────────────────────── */
const slugMap: Record<string, string> = {
  "SOD (Sertifikat Online Diantara)": "certificate-generator",
  "Accounting Diantara": "accounting-system",
  "Si-Bening": "sibening",
};

/* ── Custom Cursor ───────────────────────────────────────── */
interface CursorState {
  visible: boolean;
}

function CustomCursor({ visible }: CursorState) {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !dotRef.current) return;

    const xTo = gsap.quickTo(dotRef.current, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(dotRef.current, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[3px]"
    >
      {/* Red dot */}
      <div className="w-2 h-2 rounded-full bg-[#E10600]" />
      {/* Label */}
      <span className="font-mono text-[8px] uppercase tracking-widest text-white leading-none">
        OPEN
      </span>
    </div>
  );
}

/* ── Project Card ────────────────────────────────────────── */
interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  year: string;
  type: string;
  slug: string;
  index: number;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}

function ProjectCard({
  title,
  description,
  image,
  tags,
  year,
  type,
  slug,
  index,
  onCursorEnter,
  onCursorLeave,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderLineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  /* ── Card hover GSAP ─────────────────────────────────── */
  useEffect(() => {
    const card = cardRef.current;
    const line = borderLineRef.current;
    const content = contentRef.current;
    if (!card || !line || !content) return;

    const onEnter = () => {
      setIsHovered(true);
      onCursorEnter();
      gsap.to(line, {
        scaleY: 1,
        transformOrigin: "top",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(content, { x: 6, duration: 0.3, ease: "power2.out" });
    };

    const onLeave = () => {
      setIsHovered(false);
      onCursorLeave();
      gsap.to(line, {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(content, { x: 0, duration: 0.25, ease: "power2.in" });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [onCursorEnter, onCursorLeave]);

  /* ── Button fill GSAP ────────────────────────────────── */
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    // Set initial state
    gsap.set(btn, { backgroundColor: "transparent", color: "#ffffff" });

    const onEnter = () => {
      gsap.to(btn, {
        backgroundColor: "#E10600",
        color: "#000000",
        duration: 0.22,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(btn, {
        backgroundColor: "transparent",
        color: "#ffffff",
        duration: 0.22,
        ease: "power2.in",
      });
    };

    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, [isHovered]);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } gap-8 md:gap-16 items-center cursor-none`}
    >
      {/* Red left border line */}
      <div
        ref={borderLineRef}
        aria-hidden="true"
        className="absolute top-0 bottom-0 w-[3px] bg-[#E10600] z-10"
        style={{
          [isEven ? "left" : "right"]: "-16px",
          transform: "scaleY(0)",
          transformOrigin: "top",
        }}
      />

      {/* Image Section */}
      <div className="w-full md:w-3/5 relative aspect-video group overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content Section */}
      <div
        ref={contentRef}
        className="w-full md:w-2/5 flex flex-col justify-center"
      >
        <span className="text-[#E10600] font-mono text-sm uppercase mb-2 tracking-widest">
          {type} — {year}
        </span>
        <h3 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-6 leading-none">
          {title}
        </h3>
        <p className="text-neutral-400 text-lg leading-relaxed mb-8">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono uppercase border border-white/20 px-3 py-1 text-neutral-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* VIEW DETAIL button — Framer Motion show/hide */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div ref={btnRef} className="inline-block">
                <Link
                  href={`/projects/${slug}`}
                  aria-label={`View detail for ${title}`}
                  className="block font-mono text-sm uppercase tracking-widest px-5 py-3 border border-[#E10600]"
                  style={{ color: "inherit" }}
                >
                  VIEW DETAIL →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── ProjectShowcase ─────────────────────────────────────── */
export function ProjectShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleCursorEnter = useCallback(() => setCursorVisible(true), []);
  const handleCursorLeave = useCallback(() => setCursorVisible(false), []);

  /* ── Scroll entrance GSAP ScrollTrigger ──────────────── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = wrapperRef.current?.querySelectorAll<HTMLElement>(
      "[data-project-card]"
    );
    if (!cards || cards.length === 0) return;

    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      const st = ScrollTrigger.getById(`project-card-${i}`);
      if (st) triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <CustomCursor visible={cursorVisible} />
      <div ref={wrapperRef} className="flex flex-col gap-24 md:gap-32">
        {PROJECTS_DATA.map((project, index) => {
          const slug = slugMap[project.title] ?? project.id;
          return (
            <div
              key={project.id}
              data-project-card
              style={{ opacity: 0 }}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                year={project.year}
                type={project.type}
                slug={slug}
                index={index}
                onCursorEnter={handleCursorEnter}
                onCursorLeave={handleCursorLeave}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
