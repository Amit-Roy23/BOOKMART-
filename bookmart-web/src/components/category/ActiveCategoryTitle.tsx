"use client";

interface ActiveCategoryTitleProps {
  name: string;
}

export function ActiveCategoryTitle({ name }: ActiveCategoryTitleProps) {
  return (
    <div className="h-7 mb-3 flex items-center justify-center" aria-live="polite">
      <span
        key={name}
        className="animate-fade-in text-lg font-semibold text-brand-dark tracking-tight"
      >
        {name}
      </span>
    </div>
  );
}
