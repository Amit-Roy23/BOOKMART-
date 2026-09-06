"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchListings } from "@/services/listings";
import type { ListingsData, Listing } from "@/types/listings";

type Filter = "all" | "active" | "sold" | "draft";

function matchesFilter(listing: Listing, filter: Filter): boolean {
  if (filter === "all") return true;
  return listing.status === filter;
}

export function useListings() {
  const [data, setData] = useState<ListingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchListings();
      setData(result);
    } catch {
      setError("We couldn't load your listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = debounced.trim().toLowerCase();
    return data.listings.filter((l) => {
      const okFilter = matchesFilter(l, filter);
      const okSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.author.toLowerCase().includes(q) ||
        l.status.includes(q);
      return okFilter && okSearch;
    });
  }, [data, debounced, filter]);

  const counts = useMemo(() => {
    const list = data?.listings ?? [];
    return {
      all: list.length,
      active: list.filter((l) => l.status === "active").length,
      sold: list.filter((l) => l.status === "sold").length,
      draft: list.filter((l) => l.status === "draft").length,
    };
  }, [data]);

  return {
    data,
    loading,
    error,
    reload: load,
    query,
    setQuery,
    filter,
    setFilter,
    filtered,
    counts,
  };
}
