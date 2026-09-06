"use client";

import { SearchX } from "lucide-react";

interface SearchEmptyStateProps {
  onClearFilters: () => void;
  onGoHome: () => void;
}

export default function SearchEmptyState({ onClearFilters, onGoHome }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <SearchX className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-900">No books found</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        Try using different keywords or adjusting your filters.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onClearFilters}
          className="rounded-[12px] bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          Clear Filters
        </button>
        <button
          onClick={onGoHome}
          className="rounded-[12px] border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-primary hover:text-primary"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
