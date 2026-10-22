"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data";
import { CVModal } from "./ui/cv-modal";

const menuItems = [
    { title: "Home", href: "/" },
    { title: "About", href: "/#about" },
    { title: "Project", href: "/#projects" },
    { title: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCvOpen, setIsCvOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuVariants = {
        initial: { x: "100%" },
        animate: {
            x: 0,
            transition: { duration: 0.8, ease: [0.32, 0, 0.67, 0] as const }
        },
        exit: {
            x: "100%",
            transition: { duration: 0.7, ease: [0.32, 0, 0.67, 0] as const }
        },
    };

    const linkVariants = {
        initial: { y: "100%", opacity: 0 },
        animate: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
        }),
        exit: { y: "50%", opacity: 0, transition: { duration: 0.3 } }
    };

    const containerVariants = {
        animate: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        },
        exit: {
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    }

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-[60] flex items-center justify-between px-6 py-4 transition-all duration-300 ${isScrolled && !isMenuOpen ? "bg-background/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
                    } ${isMenuOpen ? "text-transparent pointer-events-none" : "mix-blend-exclude text-white"}`}
            >
                {/* Logo */}
                <Link href="/" className={`cursor-target relative flex items-center gap-3 group z-[70] ${isMenuOpen ? "pointer-events-auto opacity-0" : "opacity-100"} transition-opacity duration-300`}>
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 ring-2 ring-white/10 group-hover:ring-f1-red/50">
                        <Image
                            src="/logo-RYS.png"
                            alt="RYS Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="font-display font-bold text-lg md:text-xl uppercase tracking-tight group-hover:text-f1-red transition-colors">
                        Ryusaaa
                    </span>
                </Link>

                {/* Menu Trigger - Only visible when menu is closed */}
                {!isMenuOpen && (
                    <button
                        onClick={toggleMenu}
                        className="cursor-target group flex items-center gap-2 z-[70] cursor-pointer pointer-events-auto"
                    >
                        <span className="font-display font-medium uppercase tracking-wider text-sm hidden md:block group-hover:text-f1-red transition-colors">
                            Menu
                        </span>
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <span className="text-2xl font-light group-hover:text-f1-red transition-colors">+</span>
                        </div>
                    </button>
                )}
            </nav>

            {/* Staggered Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop - Only visible on desktop to focus on the menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-black/60 z-[50] hidden md:block backdrop-blur-sm"
                        />

                        <motion.div
                            variants={menuVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="fixed right-0 top-0 w-full md:w-[500px] lg:w-[600px] h-screen bg-[#101015] z-[65] flex flex-col px-6 md:px-12 py-8 shadow-2xl border-l border-white/5"
                        >
                            {/* Close Button inside Menu Panel */}
                            <div className="flex justify-end mb-8 md:mb-12">
                                <button
                                    onClick={toggleMenu}
                                    className="cursor-target group flex items-center gap-2 cursor-pointer text-white"
                                >
                                    <span className="font-display font-medium uppercase tracking-wider text-sm group-hover:text-f1-red transition-colors">
                                        Close
                                    </span>
                                    <X size={24} className="text-white group-hover:text-f1-red transition-colors" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <motion.div
                                variants={containerVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col gap-1 md:gap-2 flex-grow justify-center"
                            >
                                {menuItems.map((item, index) => (
                                    <div key={index} className="overflow-hidden">
                                        <motion.div
                                            custom={index}
                                            variants={linkVariants}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={toggleMenu}
                                                className="flex items-start gap-3 md:gap-4 group relative py-1"
                                            >
                                                <span className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-white group-hover:text-f1-red transition-colors duration-300 leading-[0.85]">
                                                    {item.title}
                                                </span>
                                                <span className="font-mono text-xs md:text-sm text-f1-red opacity-70 group-hover:opacity-100 transition-opacity mt-1 md:mt-2">
                                                    0{index + 1}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Socials & Info */}
                            <div className="flex flex-col gap-8 mt-12 md:mt-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
                                    exit={{ opacity: 0, y: 10 }}
                                >
                                    <p className="font-mono text-xs text-f1-red uppercase tracking-widest mb-4">Socials</p>
                                    <div className="flex gap-8 font-display text-sm text-white/80 uppercase tracking-wider">
                                        <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                                        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                                        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.7 } }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-between items-end border-t border-white/10 pt-6"
                                >
                                    <p className="text-xs text-zinc-500 font-mono max-w-[200px] leading-relaxed">
                                        Based in Bandung, Indonesia.
                                    </p>
                                    <p className="text-[10px] text-zinc-600 font-mono">
                                        © {new Date().getFullYear()} STF
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <CVModal isOpen={isCvOpen} onClose={() => setIsCvOpen(false)} />
        </>
    );
}