export default function Loading() {
  return (
    <div className="min-h-screen bg-midnight-950 text-foreground" role="status" aria-label="Loading project">
      <div className="relative border-b border-midnight-700">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-midnight-500" />
        <div className="container mx-auto px-6 md:px-12 pt-32 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] text-midnight-500 uppercase tracking-[0.25em]">Archive Record</span>
            <div className="h-[1px] w-12 bg-midnight-500" />
          </div>
          <div className="h-24 md:h-36 w-full max-w-3xl border border-midnight-700" />
        </div>
      </div>
      <div className="relative w-full aspect-[16/7] overflow-hidden border-b border-midnight-700 bg-midnight-900">
        <div className="scan-line absolute top-0 bottom-0 left-0 w-[2px] bg-midnight-500" />
      </div>
    </div>
  );
}
