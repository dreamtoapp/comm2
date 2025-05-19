'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updatePublishStatus(productId: string, publish: boolean) {
  try {
    const updated = await db.product.update({
      where: { id: productId },
      data: { published: publish },
    });
    // Revalidate product detail and main product list
    revalidatePath(`/dashboard/products/itemdetail/${productId}`);
    revalidatePath(`/`);
    return { success: true, published: updated.published };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
