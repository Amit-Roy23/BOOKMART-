"use client";

import { Calendar } from "lucide-react";

interface AnalyticsHeaderProps {
  title: string;
  subtitle: string;
  dateRangeLabel: string;
}

export default function AnalyticsHeader({ title, subtitle, dateRangeLabel }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2"
      >
        <Calendar size={16} aria-hidden="true" />
        <span>{dateRangeLabel}</span>
      </button>
    </div>
  );
}
