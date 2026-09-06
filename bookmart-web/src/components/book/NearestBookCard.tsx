"use client";

import Image from "next/image";
import { MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { MockListing } from '@/types';
import { formatPrice } from '@/lib/utils';

interface NearestBookCardProps {
  book: MockListing;
}

export function NearestBookCard({ book }: NearestBookCardProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="bg-white hover:border hover:border-slate-150 rounded-xl p-3 flex flex-col shadow-2xs group hover:shadow-md transition-all duration-200 cursor-pointer block"
    >
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-50 mb-3">
        <Image
          src={book.image}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>

      <div className="flex flex-col grow">
        <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{book.title}</h3>
        <p className="text-[10px] text-slate-400 font-medium mb-2">{book.author}</p>
        <span className="text-sm font-extrabold text-slate-900 mb-2">
          {formatPrice(book.price)}
        </span>

        <div className="mt-auto pt-2 border-t border-slate-50 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
              {book.sellerAvatar ? (
                <Image
                  src={book.sellerAvatar}
                  alt={book.sellerName}
                  fill
                  className="object-cover"
                  sizes="20px"
                />
              ) : (
                <div className="bg-slate-400 w-full h-full" aria-hidden="true" />
              )}
            </div>
            <span className="text-[9px] font-bold text-slate-700 truncate">{book.sellerName}</span>
          </div>

          <div className="flex items-center justify-between text-[8px] font-semibold tracking-tight mt-0.5">
            <span className="text-brand-primary bg-brand-light px-1.5 py-0.5 rounded-sm">
              {book.condition}
            </span>
            {book.distance && (
              <span className="text-slate-400 flex items-center gap-0.5">
                <MapPin className="w-2 h-2 text-rose-400" aria-hidden="true" />
                {book.distance}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface NearestBooksRowProps {
  books: MockListing[];
  title: string;
  viewAllHref?: string;
}

export function NearestBooksRow({ books, title, viewAllHref = '/nearby' }: NearestBooksRowProps) {
  return (
    <section
      className="max-w-7xl mx-auto px-4 md:px-6 mt-20"
      aria-labelledby={`${title}-heading`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          id={`${title}-heading`}
          className="text-xl font-extrabold text-slate-900 tracking-tight"
        >
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
          <NearestBookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
