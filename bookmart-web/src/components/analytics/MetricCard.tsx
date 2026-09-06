"use client";

import type { KPIMetric } from "@/types/analytics";
import { Eye, Bookmark, MessageSquare, ShoppingBag } from "lucide-react";

const ICON_MAP = {
  eye: Eye,
  bookmark: Bookmark,
  message: MessageSquare,
  deal: ShoppingBag,
};

interface MetricCardProps {
  metric: KPIMetric;
}

export default function MetricCard({ metric }: MetricCardProps) {
  const Icon = ICON_MAP[metric.icon];

  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${metric.bgColor}`}>
          <Icon className={`h-5 w-5 ${metric.iconColor}`} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{metric.value}</p>
          <p className="text-sm text-slate-500">{metric.title}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`text-xs font-bold ${
            metric.trend === "up" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {metric.change}
        </span>
      </div>
    </div>
  );
}
