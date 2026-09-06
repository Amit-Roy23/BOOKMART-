"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartDataPoint, ChartMetric } from "@/types/analytics";

interface PerformanceChartProps {
  data: ChartDataPoint[];
  metric: ChartMetric;
  onMetricChange: (metric: ChartMetric) => void;
}

export default function PerformanceChart({ data, metric, onMetricChange }: PerformanceChartProps) {
  const gradientId = useMemo(() => `gradient-${metric}`, [metric]);

  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Performance Overview</h2>
        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Chart metric">
          <button
            type="button"
            onClick={() => onMetricChange("views")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary ${
              metric === "views" ? "bg-brand-primary text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            aria-pressed={metric === "views"}
          >
            Views
          </button>
          <button
            type="button"
            onClick={() => onMetricChange("transactions")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary ${
              metric === "transactions" ? "bg-brand-primary text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            aria-pressed={metric === "transactions"}
          >
            Transactions
          </button>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#008080" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#008080" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={8}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="#008080"
              strokeWidth={3}
              dot={{ r: 4, fill: "#008080", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#008080", strokeWidth: 0 }}
              fill={`url(#${gradientId})`}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#0B8A8F"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
