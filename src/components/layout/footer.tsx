"use client";

import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/data";
import { AsciiSignature } from "../effects/ascii-ornaments";

const DIRECTORY = [
  { label: "Archive", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-midnight-700 bg-midnight-900/60 text-archive-paper">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-midnight-700">
          {/* Colophon identity */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-xl uppercase tracking-[0.14em]">
                Satria Ibnu Safarudin
              </span>
              <span className="font-pixel text-[8px] text-midnight-500 border border-midnight-700 px-1.5 py-0.5">
                RYU
              </span>
            </div>
            <p className="text-sm text-midnight-300 max-w-sm leading-relaxed font-sans">
              Personal engineering archive documenting backend systems, web applications, and software experiments.
            </p>
            <AsciiSignature />
          </div>

          {/* Archive directory */}
          <div className="md:col-span-3">
            <p className="font-pixel text-[8px] text-midnight-500 uppercase mb-4">Directory</p>
            <ul className="flex flex-col gap-2 font-mono text-xs uppercase tracking-[0.16em]" role="list">
              {DIRECTORY.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="ma-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct channels */}
          <div className="md:col-span-4">
            <p className="font-pixel text-[8px] text-midnight-500 uppercase mb-4">Channels</p>
            <div className="flex flex-col gap-2.5 font-mono text-xs">
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="ma-link break-all w-fit">
                {SOCIAL_LINKS.email}
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ma-link w-fit"
              >
                github.com/Ryusaaa ↗
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="ma-link w-fit"
              >
                linkedin.com/in/satria-ibnu-safarudin ↗
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-midnight-500">
          <p>© {year} Satria Ibnu Safarudin · MIDNIGHT ARCHIVE</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-archive-paper transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight-500"
          >
            [ ↑ TOP ]
          </button>
        </div>
      </div>
    </footer>
  );
}
