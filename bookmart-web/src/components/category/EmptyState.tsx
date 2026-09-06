"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function EmptyState({
  title = "No Books Found",
  description = "We couldn't find any books matching your current filters.",
  buttonText = "Clear Filters",
  onButtonClick,
}: EmptyStateProps) {
  return (
    <section className="flex min-h-[500px] w-full items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <SearchX className="h-12 w-12 text-emerald-600" />
        </div>

        <h2 className="mt-8 text-3xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-4 text-gray-500 leading-7">
          {description}
        </p>

        {onButtonClick && (
          <button
            onClick={onButtonClick}
            className="
              mt-8
              rounded-xl
              bg-emerald-600
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-emerald-700
              hover:shadow-lg
            "
          >
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
}
