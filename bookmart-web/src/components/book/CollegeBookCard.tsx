"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, ChevronRight } from "lucide-react";
import type { MockListing } from "@/types";
import { formatPrice } from "@/lib/utils";

interface CollegeBookCardProps {
  book: MockListing;
}

export function CollegeBookCard({ book }: CollegeBookCardProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row block"
    >
      <div className="relative w-full md:w-32 h-44 md:h-auto rounded-t-xl md:rounded-r-none md:rounded-l-xl overflow-hidden shrink-0">
        <Image
          src={book.image}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 md:absolute md:inset-0"
          sizes="(max-width: 768px) 100vw, 128px"
        />
        <span className="absolute top-2 right-2 bg-teal-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          From Your College
        </span>
      </div>

      <div className="flex flex-col p-4 grow">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{book.title}</h3>
            <p className="text-xs text-slate-400 font-medium">{book.author}</p>
          </div>
          <span className="text-lg font-extrabold text-slate-900 shrink-0">{formatPrice(book.price)}</span>
        </div>

        {book.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal my-3">
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 text-[10px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <GraduationCap className="w-4 h-4 text-brand-primary shrink-0" />
            <span className="text-slate-700 font-bold truncate">{book.sellerName}</span>
            {book.college && <span className="text-slate-400">• {book.college}</span>}
          </div>
          <span className="text-brand-primary font-bold uppercase tracking-wide">{book.condition}</span>
        </div>
      </div>
    </Link>
  );
}

interface CollegeFeedRowProps {
  books: MockListing[];
  title: string;
  viewAllHref?: string;
}

export function CollegeFeedRow({ books, title, viewAllHref = "/college-insights" }: CollegeFeedRowProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20" aria-labelledby={`${title}-heading`}>
      <div className="flex items-center justify-between mb-6">
        <h2 id={`${title}-heading`} className="text-xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary rounded px-2 py-1"
          >
            See All <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {books.map((book) => (
          <CollegeBookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
