"use client";

interface NotificationSkeletonProps {
  count?: number;
}

export default function NotificationSkeleton({ count = 5 }: NotificationSkeletonProps) {
  return (
    <div className="space-y-4" aria-label="Loading notifications">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
            </div>
            <div className="h-3 bg-slate-200 rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
