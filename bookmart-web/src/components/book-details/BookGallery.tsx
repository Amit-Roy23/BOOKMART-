"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BookGalleryProps {
  images: string[];
  title: string;
}

export default function BookGallery({ images, title }: BookGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <Image
          src={images[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          fill
          priority
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 30vw"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative h-20 w-14 overflow-hidden rounded-[16px] border-2 transition-all duration-200",
              activeIndex === index
                ? "border-primary scale-105 shadow-[0_2px_8px_rgba(0,128,128,0.2)]"
                : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
            )}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={src}
              alt={`${title} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
