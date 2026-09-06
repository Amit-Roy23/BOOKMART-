"use client";

export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading analytics">
      <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
      <div className="h-12 w-64 bg-slate-200 rounded animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-slate-200 rounded w-16" />
                <div className="h-4 bg-slate-200 rounded w-24" />
              </div>
            </div>
            <div className="mt-4 h-4 bg-slate-200 rounded w-32" />
          </div>
        ))}
      </div>

      <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-6" />
        <div className="h-80 bg-slate-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded" />
            ))}
          </div>
        </div>
        <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-slate-100 bg-white shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 m-6 mb-4" />
        <div className="space-y-3 px-6 pb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
