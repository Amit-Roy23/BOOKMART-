"use client";

export default function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-80 rounded bg-slate-200 animate-pulse" />
        <div className="h-5 w-48 rounded bg-slate-100 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="h-5 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-full rounded bg-slate-100 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
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
      </div>
    </div>
  );
}
