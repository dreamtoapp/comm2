'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function togglePromotionStatus(
  promotionId: string,
  currentStatus: boolean
): Promise<{ success: boolean; message: string; newStatus?: boolean }> {
  try {
    const newStatus = !currentStatus;
    const updatedPromotion = await db.promotion.update({
      where: { id: promotionId },
      data: { active: newStatus },
      select: { active: true }, // Only select the field we updated to confirm
    });

    revalidatePath('/dashboard/promotions');
    return {
      success: true,
      message: `تم ${newStatus ? 'تفعيل' : 'تعطيل'} العرض بنجاح.`,
      newStatus: updatedPromotion.active
    };
  } catch (error: unknown) {
    console.error('Error toggling promotion status:', error);
    let message = 'فشل تغيير حالة العرض. يرجى المحاولة مرة أخرى.';
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      message = 'العرض المراد تغيير حالته غير موجود.';
    }
    return { success: false, message };
  }
}
