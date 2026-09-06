"use client";

import BookCard from "./BookCard";
import { books } from "@/data/books";

interface BookGridProps {
  className?: string;
}

export default function BookGrid({
  className,
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No books found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className={className}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Available Books
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold">
              {books.length}
            </span>{" "}
            books
          </p>
        </div>
      </div>

      <div
        className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
      "
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
          />
        ))}
      </div>
    </section>
  );
}
