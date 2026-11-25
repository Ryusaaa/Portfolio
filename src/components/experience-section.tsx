"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EXPERIENCE_DATA } from "@/lib/data";
import { GSAP_EASE_OUT, REDUCED_MOTION } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ExperienceSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 70%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`not all and ${REDUCED_MOTION}`, () => {
        gsap.from("[data-exp-row]", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.12,
          ease: GSAP_EASE_OUT,
          scrollTrigger: { trigger: listRef.current, start: "top 80%", once: true },
        });
      });
    },
    { scope: listRef }
  );

  return (
    <ol ref={listRef} className="relative flex flex-col pl-6 md:pl-10 list-none" aria-label="Career timeline">
      {/* Base timeline hairline */}
      <span aria-hidden="true" className="absolute left-[5px] top-0 bottom-0 w-px bg-midnight-700" />
      {/* Scroll-linked active progress rail */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="absolute left-[5px] top-0 bottom-0 w-[2px] -ml-[0.5px] bg-midnight-500 origin-top"
          style={{ scaleY }}
        />
      )}

      {EXPERIENCE_DATA.map((item, i) => (
        <li
          key={item.id}
          data-exp-row
          className="relative border-t border-midnight-700 py-12 flex flex-col md:flex-row gap-8 md:gap-16 md:px-4"
        >
          {/* Pixel timeline node */}
          <span
            aria-hidden="true"
            className={`absolute -left-6 md:-left-10 top-[3.35rem] w-[11px] h-[11px] border ${
              i === 0 ? "bg-midnight-500 border-midnight-300" : "bg-midnight-950 border-midnight-700"
            }`}
          />

          {/* Left: role + company */}
          <div className="md:w-1/3">
            <h3 className="text-xl md:text-2xl font-display font-semibold uppercase tracking-tight mb-2 text-foreground break-words leading-tight">
              {item.role}
            </h3>
            <p className="text-midnight-500 font-semibold uppercase tracking-wide text-sm mb-1 break-words font-sans">
              {item.company}
            </p>
            <p className="text-midnight-700 font-mono text-xs uppercase tracking-[0.15em]">{item.period}</p>
          </div>

          {/* Right: description + badge */}
          <div className="md:w-2/3">
            <p className="text-midnight-300 leading-relaxed text-base font-sans">{item.description}</p>
            <div className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.2em] border border-midnight-700 px-2 py-1 text-midnight-500">
              {item.type}
            </div>
          </div>
        </li>
      ))}

      <li aria-hidden="true" className="border-t border-midnight-700" />
    </ol>
  );
}
