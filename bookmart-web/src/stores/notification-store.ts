import { create } from "zustand";
import type { Notification, NotificationFilter, NotificationGroup } from "@/types/notification";
import { dummyNotifications, groupNotificationsByDate } from "@/services/notifications";

interface NotificationStore {
  notifications: Notification[];
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: dummyNotifications,
  filter: "all",
  setFilter: (filter) => set({ filter }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));

export function useFilteredNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const filter = useNotificationStore((state) => state.filter);

  const filteredNotifications = filter === "all"
    ? notifications
    : filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === filter);

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  return {
    filter,
    notifications: filteredNotifications,
    groupedNotifications,
  };
}

export function useNotificationActions() {
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const setFilter = useNotificationStore((state) => state.setFilter);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return {
    markAsRead,
    markAllAsRead,
    setFilter,
    unreadCount: unreadCount(),
  };
}
