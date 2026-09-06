"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface SearchResultsHeaderProps {
  query: string;
  totalResults: number;
  sortBy: string;
  onSortChange: (value: any) => void;
}

export default function SearchResultsHeader({ query, totalResults, sortBy, onSortChange }: SearchResultsHeaderProps) {
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("search") as string;
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  }

  function clearSearch() {
    router.push("/search");
  }

  return (
    <div className="mb-8">
      <h1 className="text-[40px] md:text-[48px] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-2">
        Search results for &quot;{query}&quot;
      </h1>
      <p className="text-base text-slate-500 mb-6">
        {totalResults} {totalResults === 1 ? "book" : "books"} found
      </p>

      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            name="search"
            defaultValue={query}
            placeholder="Search books, authors, publishers..."
            className="w-full rounded-[12px] border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
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
        </div>
      </form>
    </div>
  );
}
