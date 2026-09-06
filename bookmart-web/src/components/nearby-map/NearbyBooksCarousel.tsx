"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { NearbyMapBook } from "@/types/nearby";

interface NearbyBooksCarouselProps {
  books: NearbyMapBook[];
  selectedBookId?: string | null;
  onBookSelect?: (bookId: string) => void;
}

export default function NearbyBooksCarousel({ books, selectedBookId, onBookSelect }: NearbyBooksCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function checkScroll() {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }

  function scroll(direction: "left" | "right") {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  }

  if (books.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Nearby Books</h3>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => onBookSelect?.(book.id)}
              className={`shrink-0 w-44 rounded-[16px] border bg-white p-3 shadow-sm transition-all duration-200 cursor-pointer ${
                selectedBookId === book.id
                  ? "border-primary shadow-md"
                  : "border-slate-100 hover:shadow-md"
              }`}
            >
              <div className="relative aspect-[3/4] w-full rounded-[12px] overflow-hidden bg-slate-50 mb-3">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="176px"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Add to wishlist"
                >
                  <Heart size={12} className={book.favourite ? "fill-rose-500 text-rose-500" : "text-slate-600"} />
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1">{book.title}</h4>
              <p className="text-[10px] text-slate-500 mb-2">{book.sellerName}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-primary">₹{book.price}</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  {book.condition}
                </span>
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
