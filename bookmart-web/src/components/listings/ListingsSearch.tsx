"use client";

import { Search } from "lucide-react";

interface ListingsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ListingsSearch({ value, onChange }: ListingsSearchProps) {
  return (
    <div className="relative w-full sm:w-[320px]">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search in your listings..."
        aria-label="Search in your listings"
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-light transition-colors"
      />
    </div>
  );
}
