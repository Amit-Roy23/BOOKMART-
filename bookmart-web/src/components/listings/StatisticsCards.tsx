"use client";

import { BookOpen, Eye, Heart, TrendingUp } from "lucide-react";
import { StatisticCard } from "./StatisticCard";

interface StatisticsCardsProps {
  totalListings: number;
  totalViews: number;
  interested: number;
}

export function StatisticsCards({ totalListings, totalViews, interested }: StatisticsCardsProps) {
  return (
    <section aria-label="Listing statistics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatisticCard icon={<BookOpen className="w-6 h-6" aria-hidden="true" />} metric={String(totalListings)} label="Total Listings" />
      <StatisticCard icon={<Eye className="w-6 h-6" aria-hidden="true" />} metric={String(totalViews)} label="Total Views" />
      <StatisticCard icon={<Heart className="w-6 h-6" aria-hidden="true" />} metric={String(interested)} label="Interested" />
      <div className="bg-gradient-to-br from-brand-light to-teal-primary/10 rounded-2xl border border-brand-primary/10 p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/70 text-brand-primary flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-slate-900">Great going!</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Keep your listings active to reach more buyers.
          </p>
        </div>
      </div>
    </section>
  );
}
