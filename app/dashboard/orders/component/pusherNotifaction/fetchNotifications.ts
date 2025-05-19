// Fetch notifications and unread count from the DB (client action)
'use server';
import { getAllNotifications } from '@/lib/notifications';
import { auth } from '@/auth';

export async function fetchNotifications() {
  const session = await auth();
  if (!session?.user?.id) return { notifications: [], unreadCount: 0 };
  const notificationsRaw = await getAllNotifications({ userId: session.user.id });
  // Map userId: null to userId: undefined for NotificationType compatibility
  const notifications = notificationsRaw.map((n) => ({
    ...n,
    userId: n.userId ?? undefined,
  }));
  const unreadCount = notifications.filter((n) => n.status === 'unread').length;
  return { notifications, unreadCount };
}
