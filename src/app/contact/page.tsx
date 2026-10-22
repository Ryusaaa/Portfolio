import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { FadeIn } from "@/components/ui/fade-in";
import { SOCIAL_LINKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact | Satria Ibnu Safarudin",
  description: "Get in touch with Satria Ibnu Safarudin for junior full-stack and backend opportunities.",
};

const SOCIALS = [
  { label: "GitHub", href: SOCIAL_LINKS.github },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { label: "Instagram", href: SOCIAL_LINKS.instagram },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-f1-dark">
      <section className="relative container mx-auto px-6 pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-f1-red/5 to-transparent pointer-events-none" />

        <FadeIn>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] md:text-xs text-f1-red uppercase tracking-[0.25em]">Team Radio</span>
            <div className="h-[1px] w-12 bg-f1-red" />
          </div>
          <h1 className="font-display font-black uppercase tracking-tighter leading-[1.05] text-4xl md:text-6xl lg:text-7xl mb-4">
            Open the <span className="text-f1-red">channel</span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl text-neutral-400 leading-relaxed">
            Looking for a junior full-stack or backend developer, or just want to say hi? Send a message and I will get
            back to you.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24 mt-16 md:mt-24">
          <FadeIn delay={0.1} className="lg:col-span-2 flex flex-col gap-12">
            <div>
              <h2 className="font-mono text-neutral-500 text-sm mb-4 uppercase">Write to me</h2>
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="cursor-target text-xl md:text-2xl break-all hover:text-f1-red transition-colors"
              >
                {SOCIAL_LINKS.email}
              </a>
            </div>

            <div>
              <h2 className="font-mono text-neutral-500 text-sm mb-4 uppercase">Based in</h2>
              <p className="text-xl md:text-2xl">Bandung, Indonesia</p>
            </div>

            <div>
              <h2 className="font-mono text-neutral-500 text-sm mb-4 uppercase">Socials</h2>
              <ul className="flex flex-col border-t border-white/10">
                {SOCIALS.map((s) => (
                  <li key={s.label} className="border-b border-white/10">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target group flex items-center justify-between py-4 text-lg hover:text-f1-red transition-colors"
                    >
                      {s.label}
                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-3">
            <ContactForm />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}