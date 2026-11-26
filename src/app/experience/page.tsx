import type { Metadata } from "next";
import { ExperienceSection } from "@/components/experience-section";
import { AsciiRule } from "@/components/effects/ascii-ornaments";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export const metadata: Metadata = {
  description:
    "Work experience, vocational training, and education timeline of Satria Ibnu Safarudin.",
};

const CREDENTIALS = [
  {
    code: "EDU",
    title: "SMK Prakarya Internasional Bandung",
    detail: "Software and Game Development (PPLG), 2023–2026. Graduated May 5, 2026.",
  },
  {
    code: "AWD",
    title: "2nd Place — INNOVENTURE 2025, UNIKOM",
    detail: "Web Development Competition. Role: Backend Developer & Technical Lead (SiBening).",
  },
  {
    code: "ASM",
    title: "BNSP Web Development Assessment",
    detail: "Node.js & React competency assessment completed; certificate pending issuance.",
  },
  {
    code: "LNG",
    title: "TOPIK I — Level 1",
    detail: "Completed May 2026.",
  },
];

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-midnight-950 pt-24 pb-24">
      <div className="container mx-auto px-6">
        <header className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-pixel text-[9px] text-midnight-500 border border-midnight-700 px-2 py-1 bg-midnight-900">
              ARCHIVE // EXPERIENCE
            </span>
            <span className="coord-label">2023 — 2026</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight text-archive-paper mb-4">
            Career <span className="text-midnight-500">Timeline</span>
          </h1>
          <p className="text-archive-muted text-base md:text-lg max-w-2xl font-sans leading-relaxed">
            Industrial work practice, vocational training, and backend development placements.
          </p>
        </header>

        <ExperienceSection />

        <AsciiRule label="CREDENTIALS" className="my-16 px-0!" />

        <section aria-label="Education and achievements">
          <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-archive-paper mb-8">
            Education &amp; Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CREDENTIALS.map((c) => (
              <SpotlightCard key={c.code} className="p-6">
                <span className="font-pixel text-[8px] text-midnight-500 block mb-3">
                  [{c.code}]
                </span>
                <h3 className="font-display font-semibold text-lg uppercase text-archive-paper mb-2">
                  {c.title}
                </h3>
                <p className="text-sm text-archive-muted font-sans leading-relaxed">
                  {c.detail}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
