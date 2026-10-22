"use client";

import { motion, Variants } from "framer-motion";

interface TextRevealProps {
    text: string;
    text2?: string;
    className?: string;
    delay?: number;
    duration?: number;
}

export function TextReveal({ text, text2, className, delay = 0, duration = 0.5 }: TextRevealProps) {
    // Split text into characters
    const characters = text.split("");
    const characters2 = text2?.split("") || [];

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: delay * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: duration,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: duration,
            },
        },
    };

    return (
        <motion.span
            style={{ display: "block" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            <span style={{ display: "block" }}>
                {characters.map((char, index) => (
                    <motion.span variants={child} key={`t1-${index}`} style={{ display: "inline-block", whiteSpace: "pre" }}>
                        {char}
                    </motion.span>
                ))}
            </span>
            {text2 && (
                <span style={{ display: "block" }}>
                    {characters2.map((char, index) => (
                        <motion.span variants={child} key={`t2-${index}`} style={{ display: "inline-block", whiteSpace: "pre" }}>
                            {char}
                        </motion.span>
                    ))}
                </span>
            )}
        </motion.span>
    );
}
