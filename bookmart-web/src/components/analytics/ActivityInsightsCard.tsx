"use client";

import type { InsightItem } from "@/types/analytics";
import { Eye, Bookmark, FolderOpen, TrendingUp } from "lucide-react";

const ICON_MAP = {
  eye: Eye,
  bookmark: Bookmark,
  category: FolderOpen,
  conversion: TrendingUp,
};

interface ActivityInsightsCardProps {
  insights: InsightItem[];
}

export default function ActivityInsightsCard({ insights }: ActivityInsightsCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Activity Insights</h2>
        <button
          type="button"
          className="text-sm font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          View detailed insights →
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((item) => {
          const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Eye;
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600">
                <Icon size={18} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{item.metric}</p>
                {item.trend && (
                  <p className={`text-xs font-semibold ${item.trendUp ? "text-emerald-600" : "text-rose-600"}`}>
                    {item.trend}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
