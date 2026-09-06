"use client";

import type { PriceDropData } from "@/types/notification";

interface PriceDropNotificationProps {
  data: PriceDropData;
}

export default function PriceDropNotification({ data }: PriceDropNotificationProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">{data.bookTitle}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-slate-500 line-through">₹{data.originalPrice}</span>
            <span className="text-base font-extrabold text-emerald-600">₹{data.newPrice}</span>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
              {data.discount}% OFF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
