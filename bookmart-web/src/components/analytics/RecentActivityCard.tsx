"use client";

import type { ActivityItem } from "@/types/analytics";
import { Eye, Bookmark, MessageSquare, ShoppingBag } from "lucide-react";

const ICON_MAP = {
  eye: Eye,
  bookmark: Bookmark,
  message: MessageSquare,
  deal: ShoppingBag,
};

interface RecentActivityCardProps {
  items: ActivityItem[];
}

export default function RecentActivityCard({ items }: RecentActivityCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
        <button
          type="button"
          className="text-sm font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Eye;
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600">
                <Icon size={18} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
