"use client";

import { Eye, Heart, MessageSquare } from "lucide-react";

interface ListingMetricsProps {
  views: number;
  interested: number;
  messages: number;
}

export function ListingMetrics({ views, interested, messages }: ListingMetricsProps) {
  const items = [
    { icon: <Eye className="w-4 h-4" aria-hidden="true" />, value: views, label: "Views" },
    { icon: <Heart className="w-4 h-4" aria-hidden="true" />, value: interested, label: "Interested" },
    { icon: <MessageSquare className="w-4 h-4" aria-hidden="true" />, value: messages, label: "Messages" },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 w-full sm:w-auto">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 min-w-0">
          <span className="text-brand-primary shrink-0" aria-hidden="true">
            {item.icon}
          </span>
          <span className="text-sm min-w-0">
            <span className="font-bold text-slate-900 leading-none">{item.value}</span>{" "}
            <span className="text-slate-400 text-xs">{item.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
