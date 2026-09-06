"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Author } from "@/types/author";

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link
      href={`/authors/${author.slug}`}
      className="group block rounded-[16px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1"
    >
      <div className="flex items-center gap-5">
        <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-full border-2 border-slate-100">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="140px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
            {author.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500 leading-relaxed line-clamp-2">
            {author.bio}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <BookOpen size={14} className="text-primary" />
            <span className="font-medium">{author.bookCount} Books</span>
          </div>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center justify-center rounded-[12px] border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
            View Books
          </span>
        </div>
      </div>
    </Link>
  );
}
