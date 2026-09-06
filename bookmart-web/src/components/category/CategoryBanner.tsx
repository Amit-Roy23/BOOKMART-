"use client";

import Image from "next/image";

interface CategoryBannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function CategoryBanner({
  title = "Discover Amazing Science Fiction Books",
  subtitle = "Buy affordable second-hand books from verified students and trusted sellers near you.",
  image = "/images/banner/science-fiction.jpg",
}: CategoryBannerProps) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl">
      <div className="relative h-[240px] w-full lg:h-[280px]">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-xl px-10">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              Featured Collection
            </span>

            <h2 className="mt-5 text-4xl font-bold leading-tight text-white lg:text-5xl">
              {title}
            </h2>

            <p className="mt-4 text-lg leading-7 text-gray-200">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
