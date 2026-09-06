"use client";

interface SearchSortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchSortDropdown({ value, onChange }: SearchSortDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-[12px] border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        <option value="relevance">Relevance</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="rating">Highest Rated</option>
        <option value="nearest">Nearest Seller</option>
        <option value="popular">Most Popular</option>
      </select>
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
    </div>
  );
}
