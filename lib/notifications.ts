// Notification DB utility for Alerts Page
import db from '@/lib/prisma';

export async function getAllNotifications({ userId, type }: { userId: string; type?: string }) {
  return db.notification.findMany({
    where: {
      userId,
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markAllNotificationsRead({
  userId,
  type,
}: {
  userId: string;
  type?: string;
}) {
  await db.notification.updateMany({
    where: {
      userId,
      ...(type ? { type } : {}),
      status: 'unread',
    },
    data: { status: 'read' },
  });
}
