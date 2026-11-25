"use client";

import { useState } from "react";
import { ABOUT_DATA } from "@/lib/data";
import { ArchiveTabs, type ArchiveTab } from "@/components/ui/archive-tabs";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { AsciiRule } from "@/components/effects/ascii-ornaments";
import { SakugaVfxButton } from "@/components/ui/sakuga-vfx-button";

type Discipline = "all" | "backend" | "frontend" | "ops";

const DISCIPLINES: ArchiveTab<Discipline>[] = [
  { id: "all", label: "All" },
  { id: "backend", label: "Backend & Data" },
  { id: "frontend", label: "Frontend" },
  { id: "ops", label: "Security & Ops" },
];

const SKILL_GROUPS: Array<{
  discipline: Exclude<Discipline, "all">;
  title: string;
  items: string[];
}> = [
  { discipline: "backend", title: "Languages", items: ["JavaScript", "TypeScript", "Go", "C#"] },
  { discipline: "backend", title: "Backend", items: ["Node.js", "Express.js", "Laravel", "REST APIs", "WebSocket"] },
  { discipline: "backend", title: "Databases", items: ["MySQL", "PostgreSQL", "SQL", "Database Design & Integration"] },
  { discipline: "frontend", title: "Frontend", items: ["React.js", "Vue.js", "Next.js", "Tailwind CSS"] },
  { discipline: "ops", title: "Security", items: ["Authentication", "Authorization", "RBAC", "Input Validation", "Web App Security"] },
  { discipline: "ops", title: "Deployment & Tools", items: ["Docker", "SSH", "Git", "GitHub", "Postman", "Figma", "Godot"] },
];

const INTERESTS = [
  { label: "Backend & Systems", desc: "Designing dependable APIs, relational schemas, and clean service boundaries." },
  { label: "AI & Edge AI", desc: "Practical AI integration and exploring trustworthy, low-latency computer systems." },
  { label: "Application Security", desc: "Role-based access control, validation, rate limiting, and defensive defaults." },
];

export default function AboutPage() {
  const [tab, setTab] = useState<Discipline>("all");
  const visibleGroups =
    tab === "all" ? SKILL_GROUPS : SKILL_GROUPS.filter((g) => g.discipline === tab);

  return (
    <div className="min-h-screen bg-midnight-950 pt-24 pb-24">
      <div className="container mx-auto px-6">
        <header className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-pixel text-[9px] text-midnight-500 border border-midnight-700 px-2 py-1 bg-midnight-900">
              ARCHIVE // ABOUT
            </span>
            <span className="coord-label">PPLG · BANDUNG</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight text-archive-paper mb-6">
            Profile &amp; <span className="text-midnight-500">Focus</span>
          </h1>
          <div className="max-w-2xl space-y-4 text-base md:text-lg text-archive-muted leading-relaxed font-sans">
            <p>{ABOUT_DATA.description}</p>
            <p>{ABOUT_DATA.subDescription}</p>
          </div>
        </header>

        {/* Interests */}
        <section aria-label="Technical interests" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {INTERESTS.map((item, i) => (
              <SpotlightCard key={item.label} className="p-6">
                <span className="font-pixel text-[8px] text-midnight-500 block mb-3">
                  0{i + 1}
                </span>
                <h2 className="font-display font-semibold text-lg uppercase text-archive-paper mb-2">
                  {item.label}
                </h2>
                <p className="text-sm text-archive-muted leading-relaxed font-sans">
                  {item.desc}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </section>

        <AsciiRule label="SKILLS" className="mb-14 px-0!" />

        {/* Skills filtered with 21st.dev ArchiveTabs */}
        <section aria-label="Technical skills">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-archive-paper">
              Technical Index
            </h2>
            <ArchiveTabs
              tabs={DISCIPLINES}
              activeId={tab}
              onChange={setTab}
              layoutId="about-skills-tabs"
              ariaLabel="Filter skills by discipline"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {visibleGroups.map((group) => (
              <div
                key={group.title}
                className="border border-midnight-700 bg-midnight-900/40 p-6"
              >
                <p className="font-pixel text-[8px] text-midnight-500 uppercase mb-4">
                  {group.title}
                </p>
                <ul className="flex flex-wrap gap-2" role="list">
                  {group.items.map((item) => (
                    <li key={item} className="ma-badge">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <SakugaVfxButton variant="primary" href="/projects">
              Explore Projects →
            </SakugaVfxButton>
            <SakugaVfxButton variant="secondary" href="/contact">
              Contact
            </SakugaVfxButton>
          </div>
        </section>
      </div>
    </div>
  );
}
