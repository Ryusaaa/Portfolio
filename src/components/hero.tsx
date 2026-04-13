"use client";

import { GithubProfile } from "@/lib/github";
import Link from "next/link";
import { TextReveal } from "./ui/text-reveal";
import { motion } from "framer-motion";

interface HeroProps {
    profile: GithubProfile;
}

export function Hero({ profile }: HeroProps) {
    return (
        <section className="min-h-screen flex flex-col justify-center px-6 pt-20 relative overflow-hidden">
            <div className="container mx-auto">
                {/* Name - Huge Typography */}
                <h1 className="font-display font-black uppercase tracking-tighter mix-blend-difference text-white mb-4">
                    <TextReveal
                        text="Satria"
                        text2="Ibnu"
                        className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-normal"
                        delay={0.2}
                    />
                    <span className="block text-3xl md:text-5xl text-f1-red tracking-normal mt-4 font-bold overflow-hidden">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                            className="block"
                        >
                            Junior Fullstack Developer
                        </motion.span>
                    </span>
                </h1>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 md:mt-24 border-t border-white/20 pt-8 text-neutral-400 font-mono text-sm md:text-base uppercase tracking-wider">
                    <div>
                        <p className="mb-2">Based In</p>
                        <p className="text-white">Indonesia</p>
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <p className="mb-2">Current Status</p>
                        <p className="text-white">Available for work</p>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-f1-red/5 to-transparent pointer-events-none" />
            </div>
        </section>
    );
}
