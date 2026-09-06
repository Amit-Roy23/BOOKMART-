"use client";

interface ChartMetricPillProps {
  label: string;
  value: string | number;
}

export default function ChartMetricPill({ label, value }: ChartMetricPillProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-slate-100 bg-slate-50 px-4 py-2">
      <span className="text-sm font-bold text-slate-900">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
