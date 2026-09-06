"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Plus,
  Star,
  BadgeCheck,
} from "lucide-react";

import { Book } from "@/types/book";
import { cn, formatPrice } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
}

export default function BookCard({
  book,
  className,
}: BookCardProps) {
  return (
    <div
      className={cn(
        "group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <Image
          src={book.image}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
          {book.discount}% OFF
        </div>

        {/* Wishlist */}
        <button
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-rose-50 hover:scale-110"
          aria-label="Add to Wishlist"
        >
          <Heart
            size={14}
            className={cn(
              book.favourite
                ? "fill-rose-500 text-rose-500"
                : "text-slate-600"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Title & Author */}
        <div>
          <Link
            href={`/books/${book.id}`}
            className="block text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-brand-primary transition-colors"
          >
            {book.title}
          </Link>
          <p className="text-xs text-slate-400 font-medium mt-1">
            by {book.author}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-900">
              {book.rating ?? 4.8}
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-400 font-medium">
            {book.reviewCount ?? 0} Reviews
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            {formatPrice(book.price)}
          </span>
          <span className="text-xs text-slate-400 line-through font-medium">
            {formatPrice(book.originalPrice)}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-2 py-0.5 rounded-md">
            {book.condition}
          </span>

          {book.seller.verified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              <BadgeCheck size={10} className="text-blue-500" />
              Verified
            </span>
          )}
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden relative flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-slate-500">
              {book.seller.name.charAt(0)}
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            {book.seller.name}
          </span>
        </div>

        {/* Location & Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <MapPin size={12} className="text-rose-400" />
            <span>{book.distance}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600">
            {book.stock} left
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 active:scale-95 shadow-sm"
            aria-label="Add to Cart"
          >
            <Plus size={16} />
          </button>

          <Link
            href={`/books/${book.id}`}
            className="flex-1 flex items-center justify-center rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 transition hover:border-brand-primary hover:bg-brand-light hover:text-brand-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
