"use client";

import { Plus } from "lucide-react";

interface AddBooksCardProps {
  limit: number;
  onAdd: () => void;
}

export function AddBooksCard({ limit, onAdd }: AddBooksCardProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="w-full flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center transition-colors hover:border-brand-primary hover:bg-brand-light/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Plus className="w-5 h-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-bold text-slate-700">Add More Books</span>
      <span className="text-xs text-slate-400">You can select up to {limit} books as per your plan.</span>
    </button>
  );
}
