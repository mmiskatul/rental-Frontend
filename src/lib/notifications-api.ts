import { apiRequest } from "@/lib/api";

export type NotificationType = "approval" | "rejected" | "reminder" | "system" | "booking" | "pickup" | "return" | "review";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
};

type ApiNotification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  created_at: string;
};

type ApiNotificationList = {
  notifications: ApiNotification[];
  unread_count: number;
};

export async function listNotifications() {
  const data = await apiRequest<ApiNotificationList>("/api/notifications");
  return {
    notifications: data.notifications.map(mapNotification),
    unreadCount: data.unread_count,
  };
}

export async function markNotificationRead(id: string) {
  const notification = await apiRequest<ApiNotification>(`/api/notifications/${id}/read`, { method: "PATCH" });
  return mapNotification(notification);
}

export async function markAllNotificationsRead() {
  return apiRequest<{ message: string }>("/api/notifications/read-all", { method: "PATCH" });
}

function mapNotification(notification: ApiNotification): AppNotification {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    description: notification.description,
    read: notification.read,
    createdAt: new Date(notification.created_at).toLocaleString(),
  };
}
