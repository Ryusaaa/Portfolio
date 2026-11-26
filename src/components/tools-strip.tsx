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
    <span className="inline-flex items-center gap-3 px-6 border-l border-midnight-700 h-10">
      {Icon && <Icon aria-hidden="true" className="text-xl md:text-2xl shrink-0" />}
      <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] whitespace-nowrap">{name}</span>
    </span>
  );
}

const LOGOS: LogoItem[] = TOOLS_DATA.map((t) => ({
  node: <ToolItem name={t.name} icon={t.icon} />,
  ariaLabel: t.name,
  hoverColor: "#b7d12e",
}));

const PAD = String(TOOLS_DATA.length).padStart(2, "0");

export function ToolsStrip() {
  return (
    <section
      id="tools"
      aria-label="Tools in use"
      className="py-14 md:py-16 border-y border-midnight-700 overflow-hidden bg-midnight-900"
    >
      <div className="container mx-auto px-6 flex items-center gap-4 mb-8">
        <span className="font-mono text-[10px] md:text-xs text-midnight-500 uppercase tracking-[0.25em]">Tools in use</span>
        <div aria-hidden="true" className="h-[1px] flex-1 bg-midnight-700" />
        <span className="font-mono text-[10px] md:text-xs text-midnight-300 tracking-[0.25em] tabular-nums">{PAD} TOOLS</span>
      </div>

      {/* Accessible list (screen readers) */}
      <ul className="sr-only">
        {TOOLS_DATA.map((t) => <li key={t.name}>{t.name}</li>)}
      </ul>

      <div aria-hidden="true" className="motion-reduce:hidden h-10">
        <LogoLoop
          logos={LOGOS}
          speed={60}
          direction="left"
          logoHeight={40}
          gap={0}
          pauseOnHover
          hoverSpeed={12}
          muted={0.5}
          fadeOut
          fadeOutWidth={0.1}
          scaleOnHover={false}
          className="text-midnight-300"
          ariaLabel="Tools in use"
        />
      </div>

      {/* Reduced motion: static list */}
      <ul aria-hidden="true" className="hidden motion-reduce:flex flex-wrap gap-y-4 container mx-auto px-6 text-midnight-300">
        {TOOLS_DATA.map((t) => <li key={t.name}><ToolItem name={t.name} icon={t.icon} /></li>)}
      </ul>
    </section>
  );
}
