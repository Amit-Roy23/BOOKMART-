"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, ChevronRight } from "lucide-react";
import type { MockListing } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

interface BookCardProps {
  book: MockListing;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col">
      <Link href={`/books/${book.id}`} className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-50 mb-3 block">
        <Image
          src={book.image}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose-50 z-10"
          aria-label="Add to wishlist"
        >
          <Heart className="w-3.5 h-3.5 text-slate-600 hover:text-rose-500" />
        </button>
      </Link>

      <Link href={`/books/${book.id}`} className="block">
        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1 hover:text-brand-primary transition-colors">{book.title}</h3>
      </Link>
      <p className="text-xs text-slate-400 font-medium mb-2">{book.author}</p>

      <div className="flex items-end justify-between mt-auto">
        <span className="text-base font-extrabold text-slate-900">{formatPrice(book.price)}</span>
        <span className="text-[9px] font-bold text-brand-primary bg-brand-light px-2 py-0.5 rounded-full">
          {book.condition}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 text-[10px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
            <Image
              src={book.sellerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt={book.sellerName}
              fill
              className="object-cover"
              sizes="20px"
            />
          </div>
          <span className="text-slate-700 font-medium truncate">{book.sellerName}</span>
        </div>
        {book.distance && (
          <span className="text-slate-400 flex items-center gap-0.5 shrink-0">
            <MapPin className="w-3 h-3 text-rose-400" />
            {book.distance}
          </span>
        )}
      </div>

      <Link
        href={`/books/${book.id}`}
        className="mt-3 w-full py-2 text-xs font-semibold text-brand-primary border border-slate-200 rounded-lg hover:bg-brand-light transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 duration-200"
      >
        View Details <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

interface BooksGridProps {
  books: MockListing[];
  title: string;
  viewAllHref?: string;
}

export function BooksGrid({ books, title, viewAllHref }: BooksGridProps) {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}