"use client";

import type { DateRange } from "@/types/analytics";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS = ["7D", "30D", "90D", "1Y"] as const;

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label="Date range">
      {PRESETS.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => {
            const to = value.to;
            const from = new Date(to);
            if (preset === "7D") from.setDate(to.getDate() - 7);
            else if (preset === "30D") from.setDate(to.getDate() - 30);
            else if (preset === "90D") from.setDate(to.getDate() - 90);
            else if (preset === "1Y") from.setFullYear(to.getFullYear() - 1);
            onChange({ from, to, label: `${from.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${to.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` });
          }}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          {preset}
        </button>
      ))}
    </div>
  );
}
