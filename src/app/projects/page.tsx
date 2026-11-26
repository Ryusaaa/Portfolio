"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS_DATA } from "@/lib/data";
import { ArchiveTabs, type ArchiveTab } from "@/components/ui/archive-tabs";
import { AsciiMediaReveal } from "@/components/effects/ascii-media-reveal";
import { PixelCorners } from "@/components/ui/pixel-details";
import { CoverPlate } from "@/components/cover-plate";
import { AsciiRule } from "@/components/effects/ascii-ornaments";

type CategoryFilter = "all" | "web" | "game";

export default function ProjectsPage() {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const tabs: ArchiveTab<CategoryFilter>[] = useMemo(
    () => [
      { id: "all", label: "All", count: PROJECTS_DATA.length },
      {
        id: "web",
        label: "Web & Systems",
        count: PROJECTS_DATA.filter((p) => p.type === "Web Development").length,
      },
      {
        id: "game",
        label: "Game Dev",
        count: PROJECTS_DATA.filter((p) => p.type === "Game Development").length,
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (filter === "web") return PROJECTS_DATA.filter((p) => p.type === "Web Development");
    if (filter === "game") return PROJECTS_DATA.filter((p) => p.type === "Game Development");
    return PROJECTS_DATA;
  }, [filter]);

  return (
    <div className="min-h-screen bg-midnight-950 pt-24 pb-24">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-pixel text-[9px] text-midnight-500 border border-midnight-700 px-2 py-1 bg-midnight-900">
              ARCHIVE // PROJECTS
            </span>
            <span className="coord-label">{String(PROJECTS_DATA.length).padStart(2, "0")} RECORDS</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight text-archive-paper mb-4">
            Project <span className="text-midnight-500">Catalogue</span>
          </h1>
          <p className="text-archive-muted text-base md:text-lg max-w-2xl font-sans leading-relaxed mb-8">
            Documented web platforms, backend systems, and multiplayer experiments built across
            training, competition, and professional placements.
          </p>

          <ArchiveTabs
            tabs={tabs}
            activeId={filter}
            onChange={setFilter}
            layoutId="projects-filter-tabs"
            ariaLabel="Filter projects by discipline"
          />
        </header>

        <AsciiRule label="ENTRIES" className="mb-12 px-0!" />

        {filtered.length === 0 ? (
          <div className="border border-midnight-700 bg-midnight-900/40 p-12 text-center">
            <p className="font-pixel text-[10px] text-midnight-500 mb-3">0 RECORDS</p>
            <p className="text-archive-muted text-sm font-sans">
              No projects matched this filter.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {filtered.map((project, idx) => {
              const globalIdx = PROJECTS_DATA.findIndex((p) => p.slug === project.slug);
              return (
                <article
                  key={project.id}
                  className="group border border-midnight-700 bg-midnight-900/40 hover:border-midnight-500 transition-colors p-6 md:p-8 relative"
                >
                  <PixelCorners size="sm" />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5">
                      <Link href={`/projects/${project.slug}`} className="block">
                        <AsciiMediaReveal
                          replayOnHover
                          preset="dither"
                          className="aspect-video border border-midnight-700 bg-midnight-950 relative"
                        >
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={`${project.title} preview`}
                              fill
                              sizes="(min-width: 1024px) 40vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <CoverPlate title={project.title} index={globalIdx} />
                          )}
                        </AsciiMediaReveal>
                      </Link>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="font-pixel text-[8px] text-archive-paper bg-midnight-950 border border-midnight-700 px-2 py-1">
                            P{String(globalIdx + 1).padStart(2, "0")}
                          </span>
                          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-midnight-300">
                            {project.type} · {project.year}
                          </span>
                        </div>

                        <h2 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight text-archive-paper mb-3">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="hover:text-midnight-300 transition-colors"
                          >
                            {project.title}
                          </Link>
                        </h2>

                        <p className="text-archive-muted text-sm md:text-base leading-relaxed font-sans mb-5">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.tags.map((tag) => (
                            <span key={tag} className="ma-badge">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="ma-link font-mono text-xs uppercase tracking-[0.2em] w-fit"
                      >
                        Read Case Study →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
