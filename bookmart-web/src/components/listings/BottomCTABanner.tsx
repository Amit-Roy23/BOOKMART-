"use client";

import Link from "next/link";
import { Rocket, Plus } from "lucide-react";

export function BottomCTABanner() {
  return (
    <section className="bg-gradient-to-br from-brand-light to-teal-primary/10 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/70 text-brand-primary flex items-center justify-center shrink-0">
          <Rocket className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Boost Your Listing
            <span className="text-[10px] font-bold bg-brand-primary text-white rounded-full px-2 py-0.5">
              PRO PLUS
            </span>
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Get 3x more visibility and reach more interested buyers.
          </p>
          <Link
            href="/dashboard/boost-listing"
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-brand-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Boost Now
          </Link>
        </div>
      </div>

      <div className="hidden md:block w-px bg-brand-primary/15 mx-8 self-stretch" aria-hidden="true" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/70 text-brand-primary flex items-center justify-center shrink-0">
          <Plus className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900">List New Book</h3>
          <p className="text-sm text-slate-500 mt-1">Add another book to sell and grow your shelf.</p>
          <Link
            href="/sell"
            className="mt-3 inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-brand-primary hover:bg-brand-light hover:border-brand-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            List a Book
          </Link>
        </div>
      </div>
    </section>
  );
}
