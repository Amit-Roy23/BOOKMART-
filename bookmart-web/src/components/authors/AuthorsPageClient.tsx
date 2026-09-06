"use client";

import AuthorsHero from "./AuthorsHero";
import AuthorsCategoryTabs from "./AuthorsCategoryTabs";
import AuthorsSearch from "./AuthorsSearch";
import AuthorsGrid from "./AuthorsGrid";
import AuthorsEmptyState from "./AuthorsEmptyState";
import { useAuthors } from "@/hooks/use-authors";

export default function AuthorsPageClient() {
  const {
    authors,
    search,
    setSearch,
    category,
    setCategory,
    categories,
  } = useAuthors();

  return (
    <>
      <AuthorsHero />

      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <AuthorsCategoryTabs
          categories={categories}
          activeCategory={category}
          onCategoryChange={setCategory}
        />
        <AuthorsSearch value={search} onChange={setSearch} />
      </div>

      {authors.length === 0 ? (
        <AuthorsEmptyState onReset={() => { setCategory("All"); setSearch(""); }} />
      ) : (
        <AuthorsGrid authors={authors} />
      )}
    </>
  );
}
