"use client";

import type { SystemNotificationData } from "@/types/notification";

interface SystemNotificationProps {
  data: SystemNotificationData;
}

export default function SystemNotification({ data }: SystemNotificationProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm text-slate-500 line-clamp-2">
        {data.title}: {data.message}
      </p>
    </div>
  );
}
