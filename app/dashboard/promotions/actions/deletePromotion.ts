'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deletePromotion(promotionId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Future check: Ensure promotion is not tied to non-editable historical order data if necessary
    // For now, direct delete.

    await db.promotion.delete({
      where: { id: promotionId },
    });

    revalidatePath('/dashboard/promotions');
    return { success: true, message: 'تم حذف العرض بنجاح.' };
  } catch (error: unknown) {
    console.error('Error deleting promotion:', error);
    let message = 'فشل حذف العرض. يرجى المحاولة مرة أخرى.';
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      message = 'العرض المراد حذفه غير موجود.';
    }
    // Add more specific error handling if needed (e.g., based on Prisma error codes)
    return { success: false, message };
  }
}
