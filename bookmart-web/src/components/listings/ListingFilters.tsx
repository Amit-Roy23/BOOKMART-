"use client";

import type { ListingTab } from "@/services/listings";

interface ListingFiltersProps {
  tabs: { id: ListingTab; label: string; count: number }[];
  active: string;
  onChange: (id: ListingTab) => void;
}

export function ListingFilters({ tabs, active, onChange }: ListingFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter listings by status">
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
              selected
                ? "bg-brand-primary text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-brand-light"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        );
      })}
    </div>
  );
}
