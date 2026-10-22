export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0C162F] text-white" role="status" aria-label="Loading project">
      <div className="relative border-b border-[#1e2f55]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#E32119]" />
        <div className="container mx-auto px-6 md:px-12 pt-32 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] text-[#E32119] uppercase tracking-[0.25em]">Project Telemetry</span>
            <div className="h-[1px] w-12 bg-[#E32119]" />
          </div>
          <div className="h-24 md:h-36 w-full max-w-3xl border border-[#1e2f55]" />
        </div>
      </div>
      <div className="relative w-full aspect-[16/7] overflow-hidden border-b border-[#1e2f55] bg-[#111d3e]">
        <div className="scan-line absolute top-0 bottom-0 left-0 w-[2px] bg-[#E32119]" />
      </div>
    </div>
  );
}
