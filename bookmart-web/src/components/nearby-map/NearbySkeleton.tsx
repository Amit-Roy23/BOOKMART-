"use client";

export default function NearbySkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 rounded bg-slate-200 animate-pulse" />
      <div className="h-10 w-full rounded-[12px] bg-slate-200 animate-pulse" />
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-28 rounded-full bg-slate-200 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="h-[620px] w-full rounded-[20px] bg-slate-200 animate-pulse" />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="h-64 w-full rounded-[20px] bg-slate-200 animate-pulse" />
          <div className="h-48 w-full rounded-[20px] bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
