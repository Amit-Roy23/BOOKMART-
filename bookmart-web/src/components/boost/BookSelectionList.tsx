"use client";

import { BookSelectionRow } from "./BookSelectionRow";
import { AddBooksCard } from "./AddBooksCard";
import type { BoostBook } from "@/types/boost";

interface BookSelectionListProps {
  books: BoostBook[];
  selectedBookIds: string[];
  limit: number;
  onToggle: (id: string) => void;
  onAdd: () => void;
}

export function BookSelectionList({
  books,
  selectedBookIds,
  limit,
  onToggle,
  onAdd,
}: BookSelectionListProps) {
  return (
    <section aria-labelledby="select-books-heading">
      <h2 id="select-books-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
        3. Select Books to Boost
      </h2>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {books.map((book) => (
          <BookSelectionRow
            key={book.id}
            book={book}
            selected={selectedBookIds.includes(book.id)}
            disabled={book.boosted}
            onToggle={onToggle}
          />
        ))}

        <div className="p-4">
          <AddBooksCard limit={limit} onAdd={onAdd} />
        </div>
      </div>
    </section>
  );
}
