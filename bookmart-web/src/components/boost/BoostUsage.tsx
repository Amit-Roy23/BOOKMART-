"use client";

import { BoostProgressBar } from "./BoostProgressBar";

interface BoostUsageProps {
  usageToday: number;
  limit: number;
  remaining: number;
}

export function BoostUsage({ usageToday, limit, remaining }: BoostUsageProps) {
  return (
    <section aria-labelledby="boost-usage-heading">
      <div className="flex items-end justify-between mb-4">
        <h2 id="boost-usage-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight">
          2. Today&apos;s Boost Usage
        </h2>
        <span className="text-sm font-semibold text-slate-600">
          {usageToday} / {limit} books boosted
        </span>
      </div>

      <BoostProgressBar value={usageToday} max={limit} />

      <p className="text-center text-sm text-slate-400 mt-3">
        You can boost {remaining} more {remaining === 1 ? "book" : "books"} today.
      </p>
    </section>
  );
}
