"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { GitCommit, GitPullRequest, Star, Zap, PlayCircle } from "lucide-react";

// Loose type definition for GitHub API events
interface ActivityEvent {
    id: string;
    type: string;
    repo: { name: string; url: string };
    payload: {
        commits?: { message?: string }[];
        ref_type?: string;
        action?: string;
        pull_request?: { title?: string };
        issue?: { title?: string };
    };
    created_at: string;
}

// Generate deterministic sector time based on event id
function getSectorTime(eventId: string, index: number): string {
    // Use a simple hash of the event id to generate a consistent "random" number
    let hash = 0;
    for (let i = 0; i < eventId.length; i++) {
        hash = ((hash << 5) - hash) + eventId.charCodeAt(i);
        hash = hash & hash;
    }
    const baseTime = 80 + (Math.abs(hash) % 1000) / 100 + index * 0.5;
    return baseTime.toFixed(3);
}

export function RaceDashboard({ activity }: { activity: ActivityEvent[] }) {
    // Filter for engaging events
    const events = activity
        .filter(e =>
            ['PushEvent', 'WatchEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(e.type)
        )
        .slice(0, 5); // Show top 5 "laps"

    if (events.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-neutral-800 flex-grow" />
                <h3 className="text-xl font-display font-bold uppercase text-neutral-500 tracking-widest">
                    Live Telemetry
                </h3>
                <div className="h-px bg-neutral-800 flex-grow" />
            </div>

            <div className="relative ml-4 md:ml-0 space-y-8 pl-8 md:pl-0 border-l-2 border-dashed border-neutral-800 md:border-l-0">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative md:ml-0 group"
                    >
                        {/* Timeline dot (Mobile) */}
                        <div className="absolute -left-[41px] md:hidden top-6 w-5 h-5 rounded-full bg-neutral-900 border-2 border-f1-red flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-f1-red rounded-full" />
                        </div>

                        <div className="bg-card/50 border border-neutral-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-f1-red/50 transition-all hover:bg-neutral-900 shadow-sm hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="flex items-start gap-4 w-full">
                                <div className="p-3 bg-neutral-800 rounded-lg text-f1-red shadow-inner shrink-0">
                                    {getIcon(event.type)}
                                </div>

                                <div className="flex-grow min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-f1-red font-bold uppercase tracking-wider">
                                            LAP {String(events.length - index).padStart(2, '0')}
                                        </span>
                                        <span className="text-neutral-600 text-xs">•</span>
                                        <span className="text-xs text-neutral-500 font-mono uppercase" suppressHydrationWarning>
                                            {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div className="font-bold text-lg text-white truncate pr-4">
                                        {getDescription(event)}
                                    </div>

                                    <div className="text-xs text-neutral-500 mt-2 uppercase tracking-wider font-mono flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        {event.repo.name}
                                    </div>
                                </div>
                            </div>

                            {/* Sector Time / Speed (Decorative) - F1 Style Colors */}
                            {(() => {
                                // F1 sector colors: Purple (fastest), Green (personal best), Yellow (current)
                                const sectorColors = [
                                    { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', label: 'text-purple-500' }, // Purple - Fastest
                                    { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', label: 'text-green-500' },   // Green - Personal Best
                                    { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', label: 'text-yellow-500' }, // Yellow - Current
                                ];
                                const color = sectorColors[index % sectorColors.length];
                                return (
                                    <div className={`hidden md:flex flex-col items-end shrink-0 pl-6 border-l-2 ${color.border}`}>
                                        <div className={`text-2xl font-display font-bold tabular-nums ${color.text}`}>
                                            {getSectorTime(event.id, index)}
                                        </div>
                                        <div className={`text-[10px] uppercase tracking-widest font-bold ${color.label}`}>
                                            Sector {index + 1} (s)
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function getIcon(type: string) {
    switch (type) {
        case 'PushEvent': return <GitCommit className="w-6 h-6" />;
        case 'WatchEvent': return <Star className="w-6 h-6" />;
        case 'PullRequestEvent': return <GitPullRequest className="w-6 h-6" />;
        case 'CreateEvent': return <PlayCircle className="w-6 h-6" />;
        default: return <Zap className="w-6 h-6" />;
    }
}

function getDescription(event: ActivityEvent) {
    switch (event.type) {
        case 'PushEvent':
            return event.payload.commits?.[0]?.message || "Pushed updates";
        case 'WatchEvent':
            return "Starred repository";
        case 'CreateEvent':
            return `Created ${event.payload.ref_type || 'repository'}`;
        case 'PullRequestEvent':
            return `PR ${event.payload.action}: ${event.payload.pull_request?.title}`;
        case 'IssuesEvent':
            return `Issue ${event.payload.action}: ${event.payload.issue?.title}`;
        default:
            return "System Activity";
    }
}
