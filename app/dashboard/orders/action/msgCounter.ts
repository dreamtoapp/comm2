'use server';
import db from '@/lib/prisma';

export const notifcationMsg = async (): Promise<number> => {
  try {
    return await db.notification.count({ where: { status: 'unread' } });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw new Error('Failed to fetch unread notification count');
  }
};

export const markAsRead = async (id: string): Promise<void> => {
  try {
    await db.notification.update({
      where: { id },
      data: { status: 'read' },
    });
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw new Error('Failed to update notification status');
  }
};

export const getAllNotifications = async (): Promise<{
  readMessages: { id: string; message: string; status: string }[];
  unreadMessages: { id: string; message: string; status: string }[];
}> => {
  try {
    const notifications = await db.notification.findMany({
      select: { id: true, message: true, status: true },
    });
    return {
      readMessages: notifications.filter((notification) => notification.status === 'read'),
      unreadMessages: notifications.filter((notification) => notification.status === 'unread'),
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
};

export const markAllAsRead = async (): Promise<void> => {
  try {
    await db.notification.updateMany({
      where: { status: 'unread' },
      data: { status: 'read' },
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error('Failed to mark all notifications as read');
  }
};
