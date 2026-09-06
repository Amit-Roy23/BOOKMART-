"use client";

import { useMemo, useState } from "react";
import { searchResults } from "@/data/searchResults";

export type SortOption = "relevance" | "price-low" | "price-high" | "newest" | "rating" | "nearest" | "popular";
export type AvailabilityFilter = "all" | "available" | "out-of-stock";
export type ConditionFilter = "all" | "like-new" | "good" | "fair" | "poor";
export type PriceFilter = "all" | "under-500" | "under-1000" | "under-2000";
export type LanguageFilter = "all" | "english" | "hindi" | "bengali" | "marathi" | "tamil";
export type FormatFilter = "all" | "paperback" | "hardcover" | "ebook";

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  availability: AvailabilityFilter;
  setAvailability: (filter: AvailabilityFilter) => void;
  condition: ConditionFilter;
  setCondition: (filter: ConditionFilter) => void;
  priceFilter: PriceFilter;
  setPriceFilter: (filter: PriceFilter) => void;
  language: LanguageFilter;
  setLanguage: (filter: LanguageFilter) => void;
  format: FormatFilter;
  setFormat: (filter: FormatFilter) => void;
  page: number;
  setPage: (page: number) => void;
  filteredBooks: typeof searchResults;
  totalResults: number;
  resetFilters: () => void;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [condition, setCondition] = useState<ConditionFilter>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [language, setLanguage] = useState<LanguageFilter>("all");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [page, setPage] = useState(1);

  const filteredBooks = useMemo(() => {
    let results = [...searchResults];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.publisher.toLowerCase().includes(q) ||
          book.category.toLowerCase().includes(q) ||
          book.subject.toLowerCase().includes(q)
      );
    }

    if (availability === "available") {
      results = results.filter((b) => b.available);
    } else if (availability === "out-of-stock") {
      results = results.filter((b) => !b.available);
    }

    if (condition !== "all") {
      results = results.filter((b) => b.condition.toLowerCase().includes(condition.replace("like-", "")));
    }

    if (priceFilter !== "all") {
      const maxMap: Record<string, number> = {
        "under-500": 500,
        "under-1000": 1000,
        "under-2000": 2000,
      };
      results = results.filter((b) => b.price <= (maxMap[priceFilter] || 2000));
    }

    if (language !== "all") {
      results = results.filter((b) => b.language.toLowerCase() === language);
    }

    if (format !== "all") {
      results = results.filter((b) => b.format.toLowerCase() === format);
    }

    results.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "nearest") return parseFloat(a.distance) - parseFloat(b.distance);
      return 0;
    });

    return results;
  }, [query, sortBy, availability, condition, priceFilter, language, format]);

  const totalResults = filteredBooks.length;

  function resetFilters() {
    setAvailability("all");
    setCondition("all");
    setPriceFilter("all");
    setLanguage("all");
    setFormat("all");
    setSortBy("relevance");
    setPage(1);
  }

  return {
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
  };
}
