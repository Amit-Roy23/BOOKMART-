import type { ReactNode } from "react";

interface StatisticCardProps {
  icon: ReactNode;
  metric: string;
  label: string;
  subtitle?: string;
}

export function StatisticCard({ icon, metric, label, subtitle }: StatisticCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start gap-4 transition-shadow duration-200 hover:shadow-md">
      <div className="w-12 h-12 rounded-full bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{metric}</p>
        <p className="text-sm font-semibold text-slate-700 mt-1.5">{label}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
