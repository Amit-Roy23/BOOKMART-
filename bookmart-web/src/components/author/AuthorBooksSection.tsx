"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

interface SimpleBook {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  favourite: boolean;
}

interface AuthorBooksSectionProps {
  authorName: string;
  books: SimpleBook[];
}

export default function AuthorBooksSection({ authorName, books }: AuthorBooksSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[20px] font-bold text-slate-900">
          Books by {authorName}
        </h3>
        <button className="inline-flex items-center rounded-[12px] border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-all duration-200 hover:border-primary hover:text-primary">
          View all books
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="group rounded-[16px] border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1"
          >
            <div className="relative aspect-[3/4] w-full rounded-[12px] overflow-hidden bg-slate-50 mb-3">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
              <button
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-rose-50"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={14}
                  className={book.favourite ? "fill-rose-500 text-rose-500" : "text-slate-600"}
                />
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2">
              {book.title}
            </h4>

            <div className="flex items-center gap-1 mb-2">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-900">{book.rating}</span>
              <span className="text-xs text-slate-400">
                ({book.reviewCount >= 1000 ? `${(book.reviewCount / 1000).toFixed(1)}K` : book.reviewCount})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-primary">
                ₹{book.price}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/books/${book.id}`}
                className="flex-1 flex items-center justify-center rounded-[12px] border border-slate-200 py-2 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary text-center"
              >
                View Book
              </Link>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-slate-200 text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                aria-label="Add to wishlist"
              >
                <Heart size={14} className={book.favourite ? "fill-rose-500 text-rose-500" : ""} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
