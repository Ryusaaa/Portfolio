"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`ma-btn inline-flex items-center gap-1.5 border border-midnight-700 bg-midnight-900 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-archive-paper cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-500 ${className}`}
    >
      {isLight ? (
        <Moon size={12} aria-hidden="true" className="text-midnight-500" />
      ) : (
        <Sun size={12} aria-hidden="true" className="text-midnight-500" />
      )}
      <span>{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}
