"use client";

import type { Notification } from "@/types/notification";
import NotificationCard from "./NotificationCard";

interface NotificationSectionProps {
  label: string;
  notifications: Notification[];
  onNotificationClick?: (id: string) => void;
}

export default function NotificationSection({ label, notifications, onNotificationClick }: NotificationSectionProps) {
  return (
    <section aria-labelledby={`section-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <h2
        id={`section-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="mb-4 text-lg font-bold text-slate-900"
      >
        {label}
      </h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClick={() => onNotificationClick?.(notification.id)}
          />
        ))}
      </div>
    </section>
  );
}

