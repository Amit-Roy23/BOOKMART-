"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, MapPin } from "lucide-react";
import { SearchBook } from "@/types/search";

interface SearchBookCardProps {
  book: SearchBook;
}

export default function SearchBookCard({ book }: SearchBookCardProps) {
  return (
    <div className="group rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      <div className="flex gap-5">
        {/* Left - Book Cover */}
        <Link href={`/books/${book.id}`} className="relative w-28 shrink-0 block">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] shadow-sm">
            <Image
              src={book.image}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="112px"
            />
          </div>
        </Link>

        {/* Right - Book Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/books/${book.id}`}
                className="block text-[20px] font-bold text-slate-900 leading-tight line-clamp-2 hover:text-brand-primary transition-colors"
              >
                {book.title}
              </Link>
              <p className="mt-1 text-xs text-slate-500">{book.publisher}</p>
            </div>
            <button
              className="p-2 rounded-full border border-slate-200 text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shrink-0"
              aria-label="Add to wishlist"
            >
              <Heart size={14} className={book.favourite ? "fill-rose-500 text-rose-500" : ""} />
            </button>
          </div>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-slate-900">{book.rating}</span>
            </div>
            <span className="text-xs text-slate-400">({book.reviewCount})</span>
          </div>

          {/* Condition */}
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-slate-600">{book.condition}</span>
          </div>

          {/* Seller */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-200 relative">
              <Image
                src={book.seller.avatar}
                alt={book.seller.name}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="text-xs font-medium text-slate-700">{book.seller.name}</span>
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
              <MapPin size={10} className="text-rose-400" />
              {book.distance}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-2" />

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-primary">{book.discount}% Off</span>
              <span className="text-base font-extrabold text-slate-900">₹{book.price}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 rounded-[12px] border-2 border-primary py-2 text-xs font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white">
              <ShoppingCart size={14} />
              Add to Cart
            </button>
            <Link
              href={`/books/${book.id}`}
              className="flex-1 flex items-center justify-center rounded-[12px] border border-slate-200 py-2 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-primary hover:text-primary text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
