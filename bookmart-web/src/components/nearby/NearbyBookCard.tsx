"use client";

import Image from "next/image";
import { Heart, ShoppingBag, Star, MapPin } from "lucide-react";
import { NearbyBook } from "@/types/nearby-book";

interface NearbyBookCardProps {
  book: NearbyBook;
}

export default function NearbyBookCard({ book }: NearbyBookCardProps) {
  return (
    <div className="group rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      <div className="flex gap-5">
        {/* Left - Book Cover */}
        <div className="relative w-28 shrink-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] shadow-sm">
            <Image
              src={book.image}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="112px"
            />
            {book.badge && (
              <span className="absolute top-2 right-2 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600">
                {book.badge}
              </span>
            )}
          </div>
        </div>

        {/* Right - Book Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[20px] font-bold text-slate-900 leading-tight line-clamp-2">
                {book.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{book.author}</p>
            </div>
            <button
              className="p-2 rounded-full border border-slate-200 text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shrink-0"
              aria-label="Add to wishlist"
            >
              <Heart size={14} className={book.favourite ? "fill-rose-500 text-rose-500" : ""} />
            </button>
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
              <Star size={10} className="fill-green-500 text-green-500" />
              {book.rating}
            </span>
            <span className="text-xs text-slate-400">({book.reviewCount})</span>
          </div>

          {/* Seller */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 relative">
              <Image
                src={book.seller.avatar}
                alt={book.seller.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{book.seller.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <MapPin size={10} className="text-rose-400" />
                <span>{book.distance}</span>
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-slate-600">{book.condition}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-3" />

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-extrabold text-primary">{book.discount}% Off</span>
              <span className="text-xl font-extrabold text-slate-900">₹{book.price}</span>
            </div>
          </div>

          {/* Add to Bag Button */}
          <button className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-[12px] border-2 border-primary py-2.5 text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white">
            <ShoppingBag size={16} />
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
