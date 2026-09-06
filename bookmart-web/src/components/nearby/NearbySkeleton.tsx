"use client";

export default function NearbySkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Skeleton */}
      <div className="rounded-[20px] bg-white p-8 md:p-12">
        <div className="h-12 w-64 rounded bg-slate-200 animate-pulse mb-4" />
        <div className="h-6 w-48 rounded bg-slate-100 animate-pulse" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-10 w-40 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-10 w-32 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-10 w-28 rounded-full bg-slate-200 animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="flex gap-5">
              <div className="w-28 shrink-0">
                <div className="aspect-[3/4] w-full rounded-[12px] bg-slate-200 animate-pulse" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-slate-100 animate-pulse" />
                <div className="h-8 w-20 rounded-full bg-slate-100 animate-pulse" />
                <div className="h-10 w-full rounded-[12px] bg-slate-200 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
