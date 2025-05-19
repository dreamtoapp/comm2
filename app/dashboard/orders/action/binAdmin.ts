'use server';

import db from '@/lib/prisma';
// import { pusherServer } from '@/lib/pusherSetting';
import { pusherServer } from '@/lib/pusherServer';

export const bingAdmin = async () => {
  const notification = {
    message: `طلب جديد #${100} -- ${999999}`,
    type: 'order',
  };

  try {
    // إرسال الإشعار عبر Pusher
    await db.notification.create({
      data: {
        message: notification.message,
        type: 'order',
        status: 'unread',
        // userId: userId, // Associate the notification with the authenticated user
      },
    });
    await pusherServer.trigger('admin', 'new-order', notification);
  } catch (error) {
    console.error('Debug: Error sending notification', error);
  }
};
