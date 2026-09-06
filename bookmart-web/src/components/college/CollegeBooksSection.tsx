"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BookCard } from "@/components/book/BookCard";
import { BookCardSkeleton } from "@/components/ui/skeletons";
import type { MockListing } from "@/types";

interface CollegeBooksSectionProps {
  books: MockListing[];
  loading?: boolean;
  title?: string;
  viewAllHref?: string;
}

export function CollegeBooksSection({
  books,
  loading = false,
  title = "Books from Your College",
  viewAllHref = "/search?college=1",
}: CollegeBooksSectionProps) {
  return (
    <section aria-labelledby="college-books-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="college-books-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary rounded px-2 py-1"
        >
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
          : books.slice(0, 6).map((book) => <BookCard key={book.id} book={book} />)}
      </div>
    </section>
  );
}
