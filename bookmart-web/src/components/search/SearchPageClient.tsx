"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import SearchResultsHeader from "@/components/search/SearchResultsHeader";
import SearchFilters from "@/components/search/SearchFilters";
import SearchBooksGrid from "@/components/search/SearchBooksGrid";
import SearchPagination from "@/components/search/SearchPagination";
import SearchSkeleton from "@/components/search/SearchSkeleton";
import SearchEmptyState from "@/components/search/SearchEmptyState";

export default function SearchPageClient({ initialQuery }: { initialQuery?: string }) {
  const {
    query,
    setQuery,
    sortBy,
    setSortBy,
    availability,
    setAvailability,
    condition,
    setCondition,
    priceFilter,
    setPriceFilter,
    language,
    setLanguage,
    format,
    setFormat,
    page,
    setPage,
    filteredBooks,
    totalResults,
    resetFilters,
  } = useSearch();

  const [isLoading] = useState(false);

  if (initialQuery && !query) {
    setQuery(initialQuery);
  }

  const startIndex = (page - 1) * 8;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + 8);
  const totalPages = Math.ceil(filteredBooks.length / 8);

  return (
    <>
      <SearchResultsHeader query={query} totalResults={totalResults} sortBy={sortBy} onSortChange={setSortBy} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <SearchFilters
            availability={availability}
            onAvailabilityChange={setAvailability}
            condition={condition}
            onConditionChange={setCondition}
            priceFilter={priceFilter}
            onPriceFilterChange={setPriceFilter}
            language={language}
            onLanguageChange={setLanguage}
            format={format}
            onFormatChange={setFormat}
            onClearAll={resetFilters}
          />
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <SearchSkeleton />
          ) : filteredBooks.length === 0 ? (
            <SearchEmptyState onClearFilters={resetFilters} onGoHome={() => (window.location.href = "/")} />
          ) : (
            <>
              <SearchBooksGrid books={paginatedBooks} />
              <SearchPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
