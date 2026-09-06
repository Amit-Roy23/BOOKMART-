export interface Category {
  id: string;
  name: string;
  /** One-line description shown under the title in the category card section. */
  description?: string;
  /** Optional cover image. When omitted the category falls back to its emoji + gradient. */
  image?: string;
  emoji?: string;
  gradient?: string;
}

export interface CategoryCarouselProps {
  categories: Category[];
  activeCategory?: string;
  initialCategory?: string;
  onCategoryChange?: (category: Category) => void;
  loop?: boolean;
  autoCenter?: boolean;
  className?: string;
}
