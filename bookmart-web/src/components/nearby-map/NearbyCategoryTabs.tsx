"use client";

import { SlidersHorizontal } from "lucide-react";

export type CategoryFilter = "all" | "Fiction" | "Non-fiction" | "Kids" | "Science" | "Comics & Manga" | "Stationery" | "Others";

interface NearbyCategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: any) => void;
  onOpenFilters: () => void;
}

export default function NearbyCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  onOpenFilters,
}: NearbyCategoryTabsProps) {
  return (
    <div className="mb-6 flex items-center gap-3 overflow-x-auto scrollbar-hide">
      <button
        onClick={onOpenFilters}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary hover:text-primary shrink-0"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 shrink-0 ${
            activeCategory === category
              ? "bg-primary text-white"
              : "border border-slate-200 text-slate-700 hover:border-primary hover:text-primary"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
