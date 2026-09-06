"use client";

import { Search } from "lucide-react";

interface AuthorsEmptyStateProps {
  onReset: () => void;
}

export default function AuthorsEmptyState({ onReset }: AuthorsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Search className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-900">No authors found</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        Try changing your search or category filter.
      </p>
      <button
        onClick={onReset}
        className="mt-6 rounded-[12px] bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
      >
        Reset Filters
      </button>
    </div>
  );
}
