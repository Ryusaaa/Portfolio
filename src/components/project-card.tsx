import Link from "next/link";
import { GithubRepo } from "@/types";
import { Star, GitFork, ArrowUpRight, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    repo: GithubRepo;
    index: number;
}

export function ProjectCard({ repo, index }: ProjectCardProps) {
    return (
        <Link
            href={`/projects/${repo.name}`}
            className="group relative h-full block"
        >
            <div className={cn(
                "h-full bg-card border border-neutral-800 rounded-lg overflow-hidden transition-all duration-300",
                "group-hover:border-f1-red group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(225,6,0,0.15)]"
            )}>
                {/* Livery Accent Stripe */}
                <div className="h-1 w-full bg-gradient-to-r from-f1-red via-red-500 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-neutral-600 group-hover:text-f1-red transition-colors border border-neutral-800 px-1 rounded">
                                POS {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-f1-red transition-colors opacity-0 group-hover:opacity-100" />
                    </div>

                    <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-f1-red transition-colors line-clamp-1">
                        {repo.name}
                    </h3>

                    <p className="text-neutral-400 text-sm line-clamp-2 mb-6 flex-grow font-light">
                        {repo.description || "Experimental prototype. Data classified."}
                    </p>

                    {/* Telemetry Stats */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-800 border-dashed">
                        <div className="flex items-center gap-4">
                            {repo.language && (
                                <span className="flex items-center gap-1 font-mono">
                                    <Code2 className="w-3 h-3" />
                                    {repo.language}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                            <span className="flex items-center gap-1" title="Stars">
                                <Star className="w-3 h-3 group-hover:text-yellow-500 transition-colors" />
                                {repo.stargazers_count}
                            </span>
                            <span className="flex items-center gap-1" title="Forks">
                                <GitFork className="w-3 h-3" />
                                {repo.forks_count}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hover corner accent */}
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-f1-red rounded-full shadow-[0_0_10px_#E32119] animate-pulse" />
                </div>
            </div>
        </Link>
    );
}
