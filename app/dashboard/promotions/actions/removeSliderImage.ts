'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function removeSliderImage(id: string) {
  try {
    await db.promotion.delete({ where: { id } });
    revalidatePath('/dashboard/promotions');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting slider image:', error);
    return { success: false, message: 'حدث خطأ أثناء حذف الصورة.' };
  }
}
