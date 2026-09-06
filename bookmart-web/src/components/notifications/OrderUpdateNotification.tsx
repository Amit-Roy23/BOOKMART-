"use client";

import type { OrderUpdateData } from "@/types/notification";

interface OrderUpdateNotificationProps {
  data: OrderUpdateData;
}

export default function OrderUpdateNotification({ data }: OrderUpdateNotificationProps) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
      <p className="text-sm text-slate-500 line-clamp-2">
        Order {data.orderId} - {data.message}
      </p>
    </div>
  );
}
