"use client";

import type { PromotionalNotificationData } from "@/types/notification";

interface PromotionalNotificationProps {
  data: PromotionalNotificationData;
}

export default function PromotionalNotification({ data }: PromotionalNotificationProps) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
      <p className="text-sm text-slate-500 line-clamp-2">
        {data.title}: {data.message}
      </p>
    </div>
  );
}
