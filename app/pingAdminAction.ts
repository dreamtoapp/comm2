// app/pingAdminAction.ts
// Server Action: Ping Admin with robust Pusher fallback mechanism and rate limiting
// Best practices: clear separation, robust error handling, and performance comments

'use server';
import db from '@/lib/prisma';
import { pusherServer } from '@/lib/pusherServer';

const RATE_LIMIT_MINUTES = 3; // Limit: 1 ping per 3 minutes per user/guest

/**
 * Attempts to send a real-time support alert to the admin dashboard via Pusher.
 * If Pusher fails (network error, config, quota, etc.), falls back to saving the ping in the DB for polling.
 * Always saves the ping in the DB for admin audit/history and for polling fallback.
 *
 * Performance: Only one DB write if Pusher succeeds; fallback is instant if Pusher fails.
 *
 * @param userId - The ID of the user requesting support
 * @param message - The support message
 * @returns {Object} - { success, fallback, rateLimited, error }
 */
export async function pingAdminAction(userId: string, message: string) {
  // Validate message length
  if (!message || message.trim().length < 5) {
    return { success: false, fallback: false, error: 'Message too short.' };
  }

  // Rate limiting: check last ping
  const lastPing = await db.supportPing.findFirst({
    where: { userId },
    orderBy: { timestamp: 'desc' },
  });
  if (
    lastPing &&
    Date.now() - new Date(lastPing.timestamp).getTime() < RATE_LIMIT_MINUTES * 60 * 1000
  ) {
    return { success: false, fallback: false, rateLimited: true };
  }

  // Prepare ping data
  const pingData = { userId, message, timestamp: new Date() };

  // Try Pusher, fallback to DB if needed
  let fallback = false;
  try {
    await pusherServer.trigger('admin', 'support-alert', {
      message,
      userId,
      timestamp: Date.now(),
      type: 'support',
    });
  } catch {
    fallback = true; // Mark as fallback if Pusher fails
  }

  // Always save to DB for audit/history and polling fallback
  await db.supportPing.create({ data: pingData });

  return { success: !fallback, fallback };
}
