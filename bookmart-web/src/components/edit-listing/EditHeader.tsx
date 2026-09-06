"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

export default function EditHeader({ listingId }: { listingId: string }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[40px] font-extrabold text-slate-900 leading-tight tracking-tight">
          Edit Listing
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Update your book details and manage your listing.
        </p>
      </div>
      <Link
        href={`/books/${listingId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        <Eye size={18} aria-hidden="true" />
        Preview Listing
      </Link>
    </div>
  );
}
