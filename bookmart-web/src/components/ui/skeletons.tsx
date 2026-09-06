"use client";

"use client";

import Image from "next/image";

export function BookCardSkeleton() {
  return (
    <div className="bg-white border border-slate-150 rounded-xl p-3 flex flex-col shadow-2xs animate-pulse">
      <div className="aspect-[3/4] w-full rounded-lg bg-slate-200 mb-3" />
      <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-2 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
      <div className="mt-auto pt-2 border-t border-slate-50 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-slate-200" />
          <div className="h-2 bg-slate-200 rounded w-16" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-3 bg-slate-200 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

export function CollegeCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs flex gap-4 items-start animate-pulse">
      <div className="w-20 h-28 md:w-24 md:h-32 rounded-md bg-slate-200 shrink-0" />
      <div className="flex flex-col h-full justify-between grow gap-2">
        <div>
          <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-2 bg-slate-200 rounded w-1/2 mb-2" />
          <div className="h-2 bg-slate-200 rounded w-full" />
        </div>
        <div className="flex items-center justify-between border-t border-slate-50 pt-2 mt-auto">
          <div className="h-2 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export function AuthorCardSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 flex flex-col items-center text-center animate-pulse">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-700 mb-3" />
      <div className="h-3 bg-slate-700 rounded w-20 mb-2" />
      <div className="h-2 bg-slate-700 rounded w-12 mb-2" />
      <div className="h-2 bg-slate-700 rounded w-full mb-1" />
      <div className="h-2 bg-slate-700 rounded w-3/4" />
      <div className="flex gap-0.5 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong",
  retry,
}: {
  message?: string;
  retry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="alert">
      <div className="text-rose-500 mb-3">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-800 mb-1">Failed to load</p>
      <p className="text-xs text-slate-500 mb-4 max-w-xs">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-md hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
