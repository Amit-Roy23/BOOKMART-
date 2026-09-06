"use client";

interface AuthorsCategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function AuthorsCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: AuthorsCategoryTabsProps) {
  return (
    <nav
      className="flex items-center gap-6 overflow-x-auto scrollbar-hide"
      aria-label="Author categories"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`whitespace-nowrap pb-1 text-base font-medium transition-colors duration-200 ${
            activeCategory === cat
              ? "text-primary border-b-2 border-primary"
              : "text-slate-500 hover:text-primary"
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
