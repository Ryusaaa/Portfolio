"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PROJECTS_DATA } from "@/lib/data";
import { FINE_POINTER, GSAP_EASE_IN, GSAP_EASE_OUT, REDUCED_MOTION } from "@/lib/motion";
import { TransitionLink } from "./transition/transition-link";
import { Magnet } from "./magnetic-cta";
import { CoverPlate } from "./cover-plate";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface CardProps {
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  year: string;
  type: string;
  index: number;
}

function ProjectCard({ slug, title, description, image, tags, year, type, index }: CardProps) {
  const isEven = index % 2 === 0;
  return (
    <div id={`work-${slug}`} data-reveal className="scroll-mt-24">
      <TransitionLink
        href={`/projects/${slug}`}
        transition={{ index, title, waitForCover: true }}
        aria-label={`Open ${title} project details`}
        data-card
        data-cursor-label="OPEN"
        className={`cursor-target group relative flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } gap-8 md:gap-16 items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E32119]`}
      >
        {/* Red edge line */}
        <span
          aria-hidden="true"
          data-edge
          className="absolute top-0 bottom-0 w-[3px] bg-[#E32119] z-10"
          style={{ [isEven ? "left" : "right"]: "-16px", transform: "scaleY(0)", transformOrigin: "top" }}
        />

        {/* Image */}
        <div className="w-full md:w-3/5 relative aspect-video overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <CoverPlate title={title} index={index} />
          )}
        </div>

        {/* Content */}
        <div data-content className="w-full md:w-2/5 flex flex-col justify-center">
          <span className="text-[#E32119] font-mono text-sm uppercase mb-2 tracking-widest">
            P{index + 1} — {type} — {year}
          </span>
          <h3 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-6 leading-none">
            {title}
          </h3>
          <p className="text-neutral-400 text-lg leading-relaxed mb-8">{description}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <span key={tag} className="text-xs font-mono uppercase border border-white/20 px-3 py-1 text-neutral-500">
                {tag}
              </span>
            ))}
          </div>

          <Magnet padding={40} maxOffset={6} wrapperClassName="self-start">
            <span
              className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest px-5 py-3 border border-[#E32119] text-white transition-colors duration-[220ms] group-hover:bg-[#E32119] group-focus-visible:bg-[#E32119]"
            >
              View Detail
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1">
                →
              </span>
            </span>
          </Magnet>
        </div>
      </TransitionLink>
    </div>
  );
}

export function ProjectShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // One quiet entrance per card, skipped under reduced motion.
      mm.add(`not all and ${REDUCED_MOTION}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: GSAP_EASE_OUT,
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
            }
          );
        });
      });

      // Hover / focus: edge line + 6px content shift (fine pointers only).
      mm.add(FINE_POINTER, () => {
        const cleanups: Array<() => void> = [];
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          const edge = card.querySelector<HTMLElement>("[data-edge]");
          const content = card.querySelector<HTMLElement>("[data-content]");
          if (!edge || !content) return;
          const on = () => {
            gsap.to(edge, { scaleY: 1, transformOrigin: "top", duration: 0.3, ease: "power2.out" });
            gsap.to(content, { x: 6, duration: 0.3, ease: "power2.out" });
          };
          const off = () => {
            gsap.to(edge, { scaleY: 0, transformOrigin: "bottom", duration: 0.25, ease: GSAP_EASE_IN });
            gsap.to(content, { x: 0, duration: 0.25, ease: GSAP_EASE_IN });
          };
          card.addEventListener("mouseenter", on);
          card.addEventListener("mouseleave", off);
          card.addEventListener("focus", on);
          card.addEventListener("blur", off);
          cleanups.push(() => {
            card.removeEventListener("mouseenter", on);
            card.removeEventListener("mouseleave", off);
            card.removeEventListener("focus", on);
            card.removeEventListener("blur", off);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });

      // Focus ring users on touch/keyboard still get the edge line.
      return () => mm.revert();
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="flex flex-col gap-24 md:gap-32">
      {PROJECTS_DATA.map((project, index) => (
        <ProjectCard
          key={project.id}
          slug={project.slug}
          title={project.title}
          description={project.description}
          image={project.image}
          tags={project.tags}
          year={project.year}
          type={project.type}
          index={index}
        />
      ))}
    </div>
  );
}
