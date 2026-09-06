"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/category";
import { CategorySection } from "@/components/category/CategorySection";

const CATEGORIES: Category[] = [
  { id: "romance", name: "Romance", emoji: "💖", description: "Love stories & novels" },
  { id: "science-fiction", name: "Science Fiction", emoji: "🚀", description: "Sci-fi & fantasy reads" },
  { id: "self-help", name: "Self Help", emoji: "🧘", description: "Grow & improve daily" },
  { id: "business", name: "Business", emoji: "📈", description: "Careers & strategy" },
  { id: "biographies", name: "Biographies", emoji: "👤", description: "Real life stories" },
  { id: "history", name: "History", emoji: "🏛️", description: "Past & civilizations" },
  { id: "academic", name: "Academic", emoji: "🎓", description: "School & college books" },
  { id: "comics", name: "Comics", emoji: "💥", description: "Graphic novels" },
  { id: "children", name: "Children", emoji: "🧸", description: "Books for kids" },
  { id: "cooking", name: "Cooking", emoji: "🍳", description: "Recipes & food" },
  { id: "travel", name: "Travel", emoji: "✈️", description: "Guides & adventures" },
  { id: "art", name: "Art", emoji: "🎨", description: "Craft & creativity" },
];

export function CategoriesSection() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-10" aria-label="Book categories">
      <CategorySection
        categories={CATEGORIES}
        selectedCategory={selected}
        onCategorySelect={(category) => {
          setSelected(category.id);
          router.push(`/categories/${category.id}`);
        }}
      />
    </section>
  );
}
