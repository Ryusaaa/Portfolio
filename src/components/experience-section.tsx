"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EXPERIENCE_DATA } from "@/lib/data";
import { GSAP_EASE_OUT, REDUCED_MOTION } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ExperienceSection() {
  const listRef = useRef<HTMLOListElement>(null);

  // Rows enter once, as one group (single stagger).
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
    <ol ref={listRef} className="relative flex flex-col pl-6 md:pl-10 list-none">
      {/* Timeline hairline */}
      <span aria-hidden="true" className="absolute left-[5px] top-0 bottom-0 w-px bg-[#1e2f55]" />
      {EXPERIENCE_DATA.map((item, i) => (
        <li
          key={item.id}
          data-exp-row
          className="relative border-t border-white/10 py-12 flex flex-col md:flex-row gap-8 md:gap-16 md:px-4"
        >
          <span
            aria-hidden="true"
            className={`absolute -left-6 md:-left-10 top-[3.35rem] w-[11px] h-[11px] ${i === 0 ? "bg-[#E32119]" : "bg-[#1e2f55]"}`}
          />
          <div className="md:w-1/3">
            <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight mb-2 text-white break-words">
              {item.role}
            </h3>
            <p className="text-f1-red font-bold uppercase tracking-wider text-sm md:text-base mb-1 break-words">
              {item.company}
            </p>
            <p className="text-neutral-500 font-mono text-xs md:text-sm uppercase">{item.period}</p>
          </div>
          <div className="md:w-2/3">
            <p className="text-neutral-300 leading-relaxed">{item.description}</p>
            <div className="mt-4 inline-block text-xs font-mono uppercase border border-[#1e2f55] px-2 py-1 text-neutral-400">
              {item.type}
            </div>
          </div>
        </li>
      ))}
      <li aria-hidden="true" className="border-t border-white/10" />
    </ol>
  );
}
