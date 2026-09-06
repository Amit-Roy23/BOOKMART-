"use client";

import { useMemo, useState } from "react";
import { authors, CATEGORIES } from "@/data/authors";

export function useAuthors() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    return authors.filter((author) => {
      const matchesSearch =
        author.name.toLowerCase().includes(search.toLowerCase()) ||
        author.bio.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || author.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return {
    authors: filtered,
    search,
    setSearch,
    category,
    setCategory,
    categories: CATEGORIES,
    loading,
    setLoading,
  };
}
