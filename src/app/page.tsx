
import { Hero } from "@/components/hero";
import { ToolsStrip } from "@/components/tools-strip";
import { ExperienceSection } from "@/components/experience-section";
import { ProjectShowcase } from "@/components/project-showcase";
import { ABOUT_DATA } from "@/lib/data";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";

export default function Home() {
  return (
    <div className="min-h-screen bg-f1-dark pb-0">
      <Hero />

      {/* 02 - About Section */}
      <section id="about" className="py-24 md:py-32 container mx-auto px-6">
        <FadeIn>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="md:w-1/4">
              <span className="text-f1-red font-mono text-xl font-bold">02</span>
            </div>
            <div className="md:w-3/4">
              <h2 className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight leading-tight mb-8">
                {ABOUT_DATA.title}
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl">
                <p>{ABOUT_DATA.description}</p>
                <p>{ABOUT_DATA.subDescription}</p>
              </div>

              <div className="mt-12">
                <Link
                  href="/#projects"
                  className="inline-block text-white border-b border-f1-red pb-1 font-mono uppercase text-sm hover:text-f1-red transition-colors"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 03 - Projects Section */}
      <section id="projects" className="py-24 md:py-32 container mx-auto px-6">
        <FadeIn delay={0.2}>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-16">
            <div className="md:w-1/4">
              <span className="text-f1-red font-mono text-xl font-bold">03</span>
            </div>
            <div className="md:w-3/4">
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter">
                Selected <span className="text-neutral-500">Works</span>
              </h2>
            </div>
          </div>

          <ProjectShowcase />
        </FadeIn>
      </section>

      <ToolsStrip />

      {/* 04 - Experience Section */}
      <section id="experience" className="py-24 md:py-32 container mx-auto px-6">
        <FadeIn delay={0.2}>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-16">
            <div className="md:w-1/4">
              <span className="text-f1-red font-mono text-xl font-bold">04</span>
            </div>
            <div className="md:w-3/4">
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter">
                Expe<span className="text-neutral-500">rience</span>
              </h2>
            </div>
          </div>

          <ExperienceSection />
        </FadeIn>
      </section>
    </div>
  );
}
