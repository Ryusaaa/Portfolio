"use client";

import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/data";

export function Footer() {
    return (
        <footer id="contact" className="py-24 px-6 bg-neutral-900 text-white relative overflow-hidden">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Left Column: CTA */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter leading-none mb-2">
                                Let&apos;s Work
                            </h2>
                            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter leading-none text-f1-red">
                                Together
                            </h2>
                        </div>

                        <div className="mt-12">
                            <Link
                                href={`mailto:${SOCIAL_LINKS.email}`}
                                className="inline-block border border-white/20 px-8 py-4 font-display uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                            >
                                Get In Touch
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Links */}
                    <div className="flex flex-col gap-12 md:pl-24">
                        <div>
                            <h3 className="font-mono text-neutral-500 text-sm mb-4 uppercase">Write to Me</h3>
                            <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-xl md:text-2xl font-sans hover:text-f1-red transition-colors">
                                {SOCIAL_LINKS.email}
                            </a>
                        </div>

                        <div>
                            <h3 className="font-mono text-neutral-500 text-sm mb-4 uppercase">Based In</h3>
                            <p className="text-xl md:text-2xl font-sans">
                                Indonesia
                            </p>
                        </div>

                        <div>
                            <h3 className="font-mono text-neutral-500 text-sm mb-4 uppercase">Socials</h3>
                            <div className="flex flex-col gap-2">
                                <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-f1-red transition-colors w-fit">
                                    Github
                                </a>
                                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-f1-red transition-colors w-fit">
                                    LinkedIn
                                </a>
                                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-f1-red transition-colors w-fit">
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-neutral-500">
                    <p>Built with Next.js & Tailwind</p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="uppercase hover:text-white transition-colors"
                    >
                        Back to Top
                    </button>
                </div>

                {/* Decorative F1 Element */}
                <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
                    <span className="text-[10rem] md:text-[20rem] font-display font-black leading-none">
                        RYU
                    </span>
                </div>
            </div>
        </footer>
    );
}
