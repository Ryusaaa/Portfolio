"use client";

import type { IconType } from "react-icons";
import {
  SiCloudflare, SiExpress, SiFlutter, SiGreensock, SiLaravel, SiMysql, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPrisma, SiReact, SiTailwindcss, SiTypescript, SiVite, SiVuedotjs,
} from "react-icons/si";
import LogoLoop, { type LogoItem } from "./reactbits/logo-loop";
import { TOOLS_DATA } from "@/lib/data";

const ICONS: Record<string, IconType> = {
  SiNextdotjs, SiReact, SiVuedotjs, SiVite, SiLaravel, SiNodedotjs, SiExpress, SiTailwindcss,
  SiTypescript, SiMysql, SiPostgresql, SiPrisma, SiFlutter, SiGreensock, SiCloudflare,
};

function ToolItem({ name, icon }: { name: string; icon: string }) {
  const Icon = ICONS[icon];
  return (
    <span className="inline-flex items-center gap-3 text-[#8fa0c0] hover:text-white transition-colors duration-200 px-6 border-l border-[#1e2f55] h-10">
      {Icon && <Icon aria-hidden="true" className="text-2xl md:text-3xl shrink-0" />}
      <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] whitespace-nowrap">{name}</span>
    </span>
  );
}

const LOGOS: LogoItem[] = TOOLS_DATA.map((t) => ({
  node: <ToolItem name={t.name} icon={t.icon} />,
  ariaLabel: t.name,
}));

const PAD = String(TOOLS_DATA.length).padStart(2, "0");

export function ToolsStrip() {
  return (
    <section id="tools" aria-label="Tools in use" className="py-16 md:py-20 border-y border-[#1e2f55] overflow-hidden">
      <div className="container mx-auto px-6 flex items-center gap-4 mb-10">
        <span className="font-mono text-[10px] md:text-xs text-[#E32119] uppercase tracking-[0.25em]">Tools in use</span>
        <div className="h-[1px] flex-1 bg-[#1e2f55]" />
        <span className="font-mono text-[10px] md:text-xs text-[#8fa0c0] tracking-[0.25em] tabular-nums">{PAD} TOOLS</span>
      </div>

      {/* Each tool once, for assistive tech. */}
      <ul className="sr-only">
        {TOOLS_DATA.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>

      {/* Animated loop (decorative duplicate). */}
      <div
        aria-hidden="true"
        className="motion-reduce:hidden h-10"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <LogoLoop
          logos={LOGOS}
          speed={50}
          direction="left"
          logoHeight={40}
          gap={0}
          pauseOnHover
          fadeOut={false}
          scaleOnHover={false}
          draggable={false}
          intro={false}
        />
      </div>

      {/* Reduced motion: static wrapped list. */}
      <ul aria-hidden="true" className="hidden motion-reduce:flex flex-wrap gap-y-4 container mx-auto px-6">
        {TOOLS_DATA.map((t) => (
          <li key={t.name}>
            <ToolItem name={t.name} icon={t.icon} />
          </li>
        ))}
      </ul>
    </section>
  );
}
