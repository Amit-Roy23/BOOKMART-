"use client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNotificationActions, useFilteredNotifications } from "@/stores/notification-store";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationSection from "@/components/notifications/NotificationSection";
import NotificationEmptyState from "@/components/notifications/NotificationEmptyState";

export default function NotificationsPage() {
  const { groupedNotifications } = useFilteredNotifications();
  const { markAsRead, markAllAsRead } = useNotificationActions();

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Stay updated with your account activity
          </p>
        </div>

        <NotificationFilters />

        <div className="mt-8">
          {groupedNotifications.length === 0 ? (
            <NotificationEmptyState onBrowse={() => (window.location.href = "/search")} />
          ) : (
            <div className="space-y-8">
              {groupedNotifications.map((group) => (
                <NotificationSection
                  key={group.label}
                  label={group.label}
                  notifications={group.notifications}
                  onNotificationClick={(id) => handleNotificationClick(id)}
                />
              ))}
            </div>
          )}
        </div>

        {groupedNotifications.length > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={markAllAsRead}
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
