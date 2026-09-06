import { Category } from "@/types/category";
import { CategorySectionCard } from "./CategorySectionCard";

export interface CategorySectionProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect?: (category: Category) => void;
  className?: string;
}

export function CategorySection({
  categories,
  selectedCategory,
  onCategorySelect,
  className = "",
}: CategorySectionProps) {
  return (
    <div
      role="list"
      aria-label="Book categories"
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${className}`}
    >
      {categories.map((category) => (
        <CategorySectionCard
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          onSelect={() => onCategorySelect?.(category)}
        />
      ))}
    </div>
  );
}
