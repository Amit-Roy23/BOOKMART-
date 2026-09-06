import { memo } from "react";
import { Category } from "@/types/category";

export interface CategorySectionCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}

function CategorySectionCardBase({
  category,
  isSelected,
  onSelect,
}: CategorySectionCardProps) {
  return (
    <div role="listitem" className="flex-shrink-0 snap-start">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        aria-label={`${category.name} category`}
        className={`group relative block w-full min-h-[112px] p-4 rounded-2xl text-left bg-gradient-to-br from-white to-[#f5fbfb] border-2 border-[#E5E7EB] shadow-[0_2px_10px_rgba(11,138,143,0.06)] cursor-pointer transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
          isSelected
            ? "border-brand-primary bg-brand-primary/5 shadow-[0_6px_18px_rgba(0,128,128,0.12)]"
            : "hover:border-brand-primary/40 hover:shadow-[0_4px_14px_rgba(11,138,143,0.10)]"
        }`}
      >
        <span
          className={`absolute left-4 right-4 top-1 h-1 rounded-full transition-colors duration-200 ${
            isSelected ? "bg-brand-primary" : "bg-brand-primary/15 group-hover:bg-brand-primary/40"
          }`}
          aria-hidden="true"
        />
        <h3
          className={`pr-12 font-bold text-base leading-tight tracking-tight truncate transition-colors duration-200 ${
            isSelected ? "text-brand-primary" : "text-gray-900"
          }`}
        >
          {category.name}
        </h3>
        <p className="mt-1 pr-12 text-sm text-gray-500 truncate">{category.description}</p>

        <span
          className={`absolute bottom-3 right-3 text-3xl leading-none drop-shadow-sm transition-transform duration-200 ${
            isSelected ? "scale-110" : ""
          }`}
          aria-hidden="true"
        >
          {category.emoji}
        </span>
      </button>
    </div>
  );
}

export const CategorySectionCard = memo(CategorySectionCardBase);
