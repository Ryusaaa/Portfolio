import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SakugaVfxButton } from "@/components/ui/sakuga-vfx-button";
import { AsciiSignature } from "@/components/effects/ascii-ornaments";

export const metadata: Metadata = {
  description:
    "Direct contact links for Satria Ibnu Safarudin — email, GitHub, and LinkedIn.",
};

const CHANNELS = [
  {
    code: "01",
    label: "Email",
    value: SOCIAL_LINKS.email,
    href: `mailto:${SOCIAL_LINKS.email}`,
    external: false,
    note: "Best for opportunities, technical discussions, and direct inquiries.",
  },
  {
    code: "02",
    label: "GitHub",
    value: "github.com/Ryusaaa",
    href: SOCIAL_LINKS.github,
    external: true,
    note: "Source code, repositories, and project history.",
  },
  {
    code: "03",
    label: "LinkedIn",
    value: "linkedin.com/in/satria-ibnu-safarudin",
    href: SOCIAL_LINKS.linkedin,
    external: true,
    note: "Professional profile and work/training background.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-midnight-950 pt-24 pb-24">
      <div className="container mx-auto px-6">
        <header className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-pixel text-[9px] text-midnight-500 border border-midnight-700 px-2 py-1 bg-midnight-900">
              ARCHIVE // CONTACT
            </span>
            <span className="coord-label">BANDUNG, INDONESIA</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight text-archive-paper mb-4">
            Direct <span className="text-midnight-500">Channels</span>
          </h1>
          <p className="text-archive-muted text-base md:text-lg max-w-xl font-sans leading-relaxed mb-8">
            Open to junior backend and full-stack software engineering roles. Reach out directly
            via email or connect on GitHub and LinkedIn.
          </p>

          <SakugaVfxButton
            variant="primary"
            href={`mailto:${SOCIAL_LINKS.email}`}
            external
          >
            <span className="inline-flex items-center gap-2">
              <Mail size={14} aria-hidden="true" />
              Email Satria →
            </span>
          </SakugaVfxButton>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {CHANNELS.map((ch) => (
            <SpotlightCard key={ch.code} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[8px] text-midnight-500">[{ch.code}]</span>
                  <ArrowUpRight size={15} className="text-midnight-500" aria-hidden="true" />
                </div>
                <h2 className="font-display font-bold text-2xl uppercase text-archive-paper mb-2">
                  {ch.label}
                </h2>
                <p className="text-xs text-archive-muted leading-relaxed font-sans mb-6">
                  {ch.note}
                </p>
              </div>
              <a
                href={ch.href}
                target={ch.external ? "_blank" : undefined}
                rel={ch.external ? "noopener noreferrer" : undefined}
                className="ma-link font-mono text-xs break-all w-fit"
              >
                {ch.value}
              </a>
            </SpotlightCard>
          ))}
        </div>

        <AsciiSignature />
      </div>
    </div>
  );
}
