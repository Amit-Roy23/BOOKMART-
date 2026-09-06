"use client";

import Image from "next/image";
import { Author } from "@/types/author";

interface AuthorHeroProps {
  author: Author;
}

export default function AuthorHero({ author }: AuthorHeroProps) {
  const profession = author.profession || "Author";
  const rating = author.rating ?? 4.5;
  const totalRatings = author.totalRatings ?? 100;
  const location = author.location || "Global";
  const born = author.born || "N/A";
  const language = author.language || "English";
  const followers = author.followers || "10K";
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left - Author Photo */}
        <div className="lg:col-span-3 flex justify-center lg:justify-start">
          <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full border-4 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
              priority
              sizes="200px"
            />
          </div>
        </div>

        {/* Center - Author Info */}
        <div className="lg:col-span-5">
          <h1 className="text-[40px] md:text-[52px] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-3">
            {author.name}
          </h1>
          <p className="text-base font-semibold text-primary mb-4">{profession}</p>

          <div className="flex items-center gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${star <= Math.round(rating) ? "text-yellow-400" : "text-slate-300"}`}
              >
                ★
              </span>
            ))}
            <span className="text-sm font-bold text-slate-900 ml-1">{rating}</span>
            <span className="text-sm text-slate-500">({totalRatings} ratings)</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              📍 {location}
            </span>
            <span className="flex items-center gap-2">
              🎂 Born {born}
            </span>
            <span className="flex items-center gap-2">
              🌐 {language}
            </span>
          </div>
        </div>

        {/* Right - Stats Card */}
        <div className="lg:col-span-4">
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-3 divide-x divide-slate-100">
              <div className="flex flex-col items-center justify-center py-3">
                <span className="text-[42px] font-extrabold text-primary leading-none">{author.bookCount || 0}</span>
                <span className="text-xs font-medium text-slate-500 mt-2">Books</span>
              </div>
              <div className="flex flex-col items-center justify-center py-3">
                <span className="text-[42px] font-extrabold text-slate-900 leading-none">{followers}</span>
                <span className="text-xs font-medium text-slate-500 mt-2">Followers</span>
              </div>
              <div className="flex flex-col items-center justify-center py-3">
                <span className="text-[42px] font-extrabold text-slate-900 leading-none">{author.authorReviews ?? 120}</span>
                <span className="text-xs font-medium text-slate-500 mt-2">Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
