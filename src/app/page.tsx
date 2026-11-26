import Link from "next/link";
import { AsciiReveal } from "ascii-reveal";
import { Hero } from "@/components/hero";
import { FeaturedShowcase } from "@/components/dashboard/featured-showcase";
import { ToolsStrip } from "@/components/tools-strip";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { AsciiRule } from "@/components/effects/ascii-ornaments";
import { EXPERIENCE_DATA, PROJECTS_DATA } from "@/lib/data";

const ARCHIVE_MODULES = [
  {
    code: "01",
    title: "Projects",
    summary: `${PROJECTS_DATA.length} documented systems & applications across backend, web, and game dev.`,
    href: "/projects",
    cta: "Browse Archive →",
  },
  {
    code: "02",
    title: "Experience",
    summary: `${EXPERIENCE_DATA.length} roles & vocational training placements (PT FAST Indo Talenta, BBPVP Bandung, PT DiAntara).`,
    href: "/experience",
    cta: "View Timeline →",
  },
  {
    code: "03",
    title: "About",
    summary: "PPLG background, backend & security engineering focus, and technical discipline breakdown.",
    href: "/about",
    cta: "Read Profile →",
  },
  {
    code: "04",
    title: "Contact",
    summary: "Direct email, GitHub, and LinkedIn channels for junior backend & full-stack roles.",
    href: "/contact",
    cta: "Open Channel →",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-midnight-950">
      <Hero />

      <AsciiRule label="INDEX" className="my-4" />

      {/* 21st.dev SpotlightCard Archive Directory */}
      <section aria-label="Archive overview" className="container mx-auto px-6 py-16 md:py-20">
        <AsciiReveal preset="decode" duration="fast" revealOnHydrate lazy>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ARCHIVE_MODULES.map((mod) => (
              <SpotlightCard key={mod.code} data-ascii="surface" className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-pixel text-[9px] text-midnight-500">[{mod.code}]</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-midnight-500">
                      MODULE
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-archive-paper mb-2">
                    {mod.title}
                  </h2>
                  <p className="text-xs text-archive-muted leading-relaxed font-sans mb-6">
                    {mod.summary}
                  </p>
                </div>
                <Link
                  href={mod.href}
                  data-ascii="fade"
                  className="ma-link font-mono text-[11px] uppercase tracking-[0.18em] w-fit"
                >
                  {mod.cta}
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </AsciiReveal>
      </section>

      <AsciiRule label="WORK" />

      {/* React Bits + PixelFX Featured Showcase */}
      <FeaturedShowcase />

      <ToolsStrip />

      {/* Compact Experience Preview */}
      <section aria-label="Recent experience" className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="font-pixel text-[9px] text-midnight-500 block mb-3">
              [03 // EXPERIENCE]
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-archive-paper">
              Career <span className="text-midnight-500">Record</span>
            </h2>
          </div>
          <Link href="/experience" className="ma-link font-mono text-xs uppercase tracking-[0.2em] w-fit">
            Full Timeline →
          </Link>
        </div>

        <AsciiReveal preset="decode" duration="fast" revealOnHydrate lazy>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {EXPERIENCE_DATA.map((item, i) => (
              <div key={item.id} data-ascii="surface" className="border border-midnight-700 bg-midnight-900/40 p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-pixel text-[8px] text-midnight-500">0{i + 1}</span>
                  <span className="font-mono text-[10px] uppercase text-midnight-500">{item.type}</span>
                </div>
                <h3 className="font-display font-semibold text-lg uppercase tracking-tight text-archive-paper mb-1">
                  {item.role}
                </h3>
                <p className="font-mono text-xs text-midnight-300 mb-3">{item.company}</p>
                <p className="font-mono text-[10px] text-midnight-500 uppercase">{item.period}</p>
              </div>
            ))}
          </div>
        </AsciiReveal>
      </section>
    </div>
  );
}
