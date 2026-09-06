export default function AuthorsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[16px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-5">
            <div className="h-[140px] w-[140px] shrink-0 rounded-full bg-slate-200 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-32 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
              <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
            </div>
            <div className="h-10 w-24 rounded-[12px] bg-slate-200 animate-pulse shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
