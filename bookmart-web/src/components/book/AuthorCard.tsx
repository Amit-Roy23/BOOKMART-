import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Globe } from "lucide-react";
import type { MockAuthor } from "@/types";

interface PremiumAuthorCardProps {
  author: MockAuthor;
}

export function PremiumAuthorCard({ author }: PremiumAuthorCardProps) {
  const slug = author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <Link
      href={`/authors/${slug}`}
      className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full block"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden relative mb-4 mx-auto border-4 border-slate-50 shadow-md">
        <Image
          src={author.image}
          alt={`${author.name} profile photo`}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <h3 className="text-base font-bold text-slate-900 text-center mb-1 line-clamp-1">{author.name}</h3>
      
      <div className="flex items-center justify-center gap-1 mb-2 text-amber-400" aria-label={`${author.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, sIdx) => (
          <Star
            key={sIdx}
            className={`w-3.5 h-3.5 ${sIdx < author.rating ? "fill-current" : "text-slate-300"}`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 mb-3 text-[10px] font-semibold text-slate-400">
        <Globe className="w-3 h-3" />
        <span>British • {author.booksCount} Books</span>
      </div>

      <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-3 mb-4 px-1 text-center flex-grow">
        {author.bio}
      </p>

      <span className="w-full py-2 text-xs font-semibold text-brand-primary border border-slate-200 rounded-lg hover:bg-brand-light transition-colors flex items-center justify-center gap-1">
        Explore Books <ChevronRight className="w-3 h-3" />
      </span>
    </Link>
  );
}

interface PopularAuthorsRowProps {
  authors: MockAuthor[];
  title: string;
  viewAllHref?: string;
}

export function PopularAuthorsRow({ authors, title, viewAllHref = "/authors" }: PopularAuthorsRowProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20" aria-labelledby={`${title}-heading`}>
      <div className="flex items-center justify-between mb-6">
        <h2 id={`${title}-heading`} className="text-xl font-extrabold text-slate-900 tracking-tight">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {authors.slice(0, 4).map((author, idx) => (
          <PremiumAuthorCard key={author.name || idx} author={author} />
        ))}
      </div>
    </section>
  );
}


