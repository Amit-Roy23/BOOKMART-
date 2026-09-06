"use client";

import { Search } from "lucide-react";

interface NearbySearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NearbySearchBar({ value, onChange }: NearbySearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="nearby-search" className="sr-only">Search location, books or sellers</label>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
      <input
        id="nearby-search"
        type="search"
        placeholder="Search location, books or sellers..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[12px] border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm"
      />
    </div>
  );
}
